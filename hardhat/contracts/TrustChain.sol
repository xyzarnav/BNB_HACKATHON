//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * A smart contract that allows changing a state variable of the contract and tracking the changes
 * It also allows the owner to withdraw the Ether in the contract
 * @author BuidlGuidl
 */
contract TrustChain is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}

    // Events
    event BidderCreated(address indexed bidder, uint256 bidderId);
    event ProjectCreated(uint256 indexed projectId, address creator, uint256 budget, ProjectClassfication projectType);
    event BidSubmitted(uint256 indexed bidId, uint256 projectId, address bidder, uint256 amount);
    event BondAwarded(uint256 indexed projectId, address bidder, uint256 amount, uint256 initialPayment);
    event PaymentReleased(uint256 indexed bondId, uint256 amount, ProjectCompletion newCompletion);
    // New transparency events
    event AuditorAssigned(uint256 indexed projectId, address auditor);
    event AuditorApproval(uint256 indexed bondId, ProjectCompletion milestone);
    event MediatorAssigned(uint256 indexed disputeId, address mediator);
    event DisputeResolved(uint256 indexed disputeId, DisputeOutcome outcome);
    event WhistleblowerReport(uint256 indexed projectId, bytes32 reportHash);
    event TransparencyLog(uint256 indexed projectId, string action, address actor);

    uint256 public version = 4;
    uint256 public projectId = 0;
    uint256 public bidCount = 0;
    uint256 public bondCount = 0;
    uint256 public disputeCount = 0;

    struct Project {
        address creator;
        uint256 projectId;
        string description;
        string title;
        uint256 timePeriod;
        uint256 deadline;
        uint256 budget;
        bool posted;
        ProjectClassfication projectType;
        address auditor; // Independent auditor to verify milestones
        bool hasAuditor;
    }

    struct Bid {
        uint256 bidId;
        uint256 projectId;
        address bidder;
        uint amount;
        string proposalIPFHash;
        bool accepted;
    }

    struct Bidder {
        uint bidderId;
        address bidderAddress;
        uint256 totalBids;
        uint256 reputationScore;
        bool blacklisted; // For bidders caught in corrupt activities
    }

    struct Bond {
        address obligor;
        uint projectId;
        uint amount;
        ProjectStatus status;
        ProjectCompletion completion;
        mapping(address => bool) approvals; // Multi-signature approvals
        uint256 requiredApprovals;
        uint256 currentApprovals;
        mapping(ProjectCompletion => bool) milestoneApproved; // Track which milestones are approved
    }

    struct Dispute {
        uint256 disputeId;
        uint256 bondId;
        address creator;
        address mediator;
        string evidence;
        bool resolved;
        DisputeOutcome outcome;
    }

    enum ProjectStatus {
        Approved,
        Completed,
        Disputed
    }

    enum ProjectClassfication {
        MaxRate,
        FixRate,
        MinRate
    }

    enum ProjectCompletion {
        Signed, // 20%
        Quarter, // 40%
        Half, // 60%
        ThreeQuarters, // 80%
        Full // 100%
    }

    enum DisputeOutcome {
        Pending,
        RuledForCreator,
        RuledForObligor,
        Compromise
    }

    uint256 public bidderCount;
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Bid) public bids;
    mapping(uint256 => Bidder) public bidders;
    mapping(uint256 => uint256[]) public projectBids;
    mapping(address => uint256) public bidderIds;
    mapping(uint256 => Dispute) public disputes;

    // Mapping for Bond struct with nested mapping
    mapping(uint256 => address) private bondObligor;
    mapping(uint256 => uint256) private bondProjectId;
    mapping(uint256 => uint256) private bondAmount;
    mapping(uint256 => ProjectStatus) private bondStatus;
    mapping(uint256 => ProjectCompletion) private bondCompletion;
    // New mapping to track milestone approvals
    mapping(uint256 => mapping(ProjectCompletion => bool)) private bondMilestoneApproved;
    mapping(address => mapping(uint256 => bool)) public hasBidded;
    // Auditor system
    mapping(address => bool) public approvedAuditors;
    mapping(uint256 => address[]) public projectAuditors;
    // BidEvaluation
    mapping(uint256 => bool) public evaluatedbids;
    // Bond Winners
    mapping(uint256 => uint256) public bondWinners;
    // Whistleblower system
    mapping(bytes32 => string) private reportDescriptions;
    mapping(bytes32 => bool) private whistleblowerReports;
    mapping(bytes32 => uint256) private whistleblowerRewards;

    // Transparency log
    struct LogEntry {
        address actor;
        string action;
        uint256 timestamp;
    }
    mapping(uint256 => LogEntry[]) public transparencyLogs;

    // Create a log entry for important actions
    function _createLog(uint256 _projectId, string memory _action) private {
        transparencyLogs[_projectId].push(LogEntry({ actor: msg.sender, action: _action, timestamp: block.timestamp }));
        emit TransparencyLog(_projectId, _action, msg.sender);
    }
    // Add this state variable to the contract
    address[] public approvedAuditorsList;
    // Register as an approved auditor
    function registerAuditor(address _auditor) public onlyOwner {
        require(!approvedAuditors[_auditor], "Auditor already registered");
        approvedAuditors[_auditor] = true;
        approvedAuditorsList.push(_auditor);
    }

    function removeAuditor(address _auditor) public onlyOwner {
        require(approvedAuditors[_auditor], "Auditor not registered");
        approvedAuditors[_auditor] = false;

        // Remove from the array
        for (uint i = 0; i < approvedAuditorsList.length; i++) {
            if (approvedAuditorsList[i] == _auditor) {
                // Replace with the last element and pop
                approvedAuditorsList[i] = approvedAuditorsList[approvedAuditorsList.length - 1];
                approvedAuditorsList.pop();
                break;
            }
        }
    }

    function createBidder() public {
        require(bidderIds[msg.sender] == 0, "Bidder already exists");
        require(!bidders[bidderIds[msg.sender]].blacklisted, "Address is blacklisted");
        bidderCount++;
        bidderIds[msg.sender] = bidderCount;
        bidders[bidderCount] = Bidder({
            bidderId: bidderCount,
            bidderAddress: msg.sender,
            totalBids: 0,
            reputationScore: 0,
            blacklisted: false
        });
        emit BidderCreated(msg.sender, bidderCount);
    }

    function createProject(
        string memory _title,
        string memory _description,
        uint256 _timeperiod,
        uint _budget,
        ProjectClassfication _jobType
    ) public {
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(bytes(_title).length > 0, "Description cannot be empty");
        require(_timeperiod > 0, "Time period must be positive");
        require(_budget > 0, "Budget must be positive");

        projectId++;
        projects[projectId] = Project({
            creator: msg.sender,
            projectId: projectId,
            description: _description,
            budget: _budget,
            title: _title,
            timePeriod: _timeperiod,
            deadline: block.timestamp + _timeperiod,
            posted: true,
            projectType: _jobType,
            auditor: address(0),
            hasAuditor: false
        });

        emit ProjectCreated(projectId, msg.sender, _budget, _jobType);

        _createLog(projectId, "PROJECT_CREATED");
    }

    // Assign an auditor to an existing project
    function assignAuditor(uint256 _projectId) public {
        Project storage project = projects[_projectId];
        require(msg.sender == project.creator, "Only creator can assign auditor");
        require(approvedAuditorsList.length > 0, "No approved auditors available");
        require(!project.hasAuditor, "Auditor already assigned");

        // Generate a pseudorandom number for auditor selection
        uint256 randomIndex = uint256(
            keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender, _projectId))
        ) % approvedAuditorsList.length;

        // Assign the randomly selected auditor
        address selectedAuditor = approvedAuditorsList[randomIndex];
        project.auditor = selectedAuditor;
        project.hasAuditor = true;

        emit AuditorAssigned(_projectId, selectedAuditor);
        _createLog(_projectId, "AUDITOR_ASSIGNED");
    }

    // Whistleblower function to report corruption
    function reportCorruption(uint256 _projectId, string memory _evidence) public {
        bytes32 reportHash = keccak256(abi.encodePacked(_projectId, msg.sender, _evidence));
        whistleblowerReports[reportHash] = true;
        reportDescriptions[reportHash] = _evidence; // Store the evidence
        emit WhistleblowerReport(_projectId, reportHash);
        _createLog(_projectId, "CORRUPTION_REPORTED");
    }
    // //function to view the report description
    // function getWhistleblowerReport(uint256 _projectId, string memory _evidence) public view returns (string memory) {
    //     bytes32 reportHash = keccak256(abi.encodePacked(_projectId, msg.sender, _evidence));
    //     require(whistleblowerReports[reportHash], "Report does not exist");
    //     return reportDescriptions[reportHash];
    // }
    // Allow contract owner to blacklist a bidder
    function blacklistBidder(uint256 _bidderId) public onlyOwner {
        bidders[_bidderId].blacklisted = true;
        _createLog(0, "BIDDER_BLACKLISTED");
    }

    // Function to verify if a project is past deadline
    function isProjectLate(uint256 _projectId) public view returns (bool) {
        return block.timestamp > projects[_projectId].deadline;
    }

    // Rest of existing functions with security and anti-corruption enhancements

    function createBid(uint256 _projectId, string memory _proposalIPFHash, uint256 _amount) public {
        Project storage pj = projects[_projectId];
        Bidder storage bidder = bidders[bidderIds[msg.sender]];

        // Add check for existing bid from this address
        require(!hasBidded[msg.sender][_projectId], "You have already submitted a bid for this project");

        require(!bidder.blacklisted, "Bidder is blacklisted");
        require(pj.creator != msg.sender, "Creator cannot participate in bidding process");
        require(bidderIds[msg.sender] != 0, "Bidder does not exist");
        require(pj.posted == true, "Project does not exist or is not posted");
        require(projects[_projectId].creator != address(0), "Project does not exist");
        require(!isProjectLate(_projectId), "Project bidding deadline has passed");

        bidCount++;
        if (pj.projectType == ProjectClassfication.FixRate) {
            require(_amount == pj.budget, "Invalid amount entered, In Fix Rate Amount Must be Fix");
        }

        bids[bidCount] = Bid({
            bidId: bidCount,
            projectId: _projectId,
            bidder: msg.sender,
            amount: _amount,
            proposalIPFHash: _proposalIPFHash,
            accepted: false
        });

        // Mark that this address has bidded for this project
        hasBidded[msg.sender][_projectId] = true;

        projectBids[_projectId].push(bidCount);
        bidder.totalBids++;

        emit BidSubmitted(bidCount, _projectId, msg.sender, _amount);
        _createLog(_projectId, "BID_SUBMITTED");
    }

    // Existing bidEvaluation function remains mostly unchanged
    function bidEvaluation(uint256 _projectId) public {
        Project storage pj = projects[_projectId];
        require(pj.posted == true, "Project does not exist or is not posted");
        require(projects[_projectId].creator != address(0), "Project does not exist");
        require(evaluatedbids[_projectId] != true, "Bid Already Evaluated");
        uint256[] memory bidIds = projectBids[_projectId];
        require(bidIds.length > 0, "No bids available for this project");
        uint256 winnerBidId = 0;

        if (pj.projectType == ProjectClassfication.FixRate) {
            uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
            evaluatedbids[_projectId] = true;
            winnerBidId = bidIds[random % bidIds.length];
            bondWinners[_projectId] = winnerBidId;
            return;
        } else if (pj.projectType == ProjectClassfication.MinRate) {
            uint256 minBidAmount = type(uint256).max;
            uint256[] memory tiedBids = new uint256[](bidIds.length);
            uint256 tiedCount = 0;

            for (uint256 i = 0; i < bidIds.length; i++) {
                uint256 currentBidId = bidIds[i];
                uint256 currentBidAmount = bids[currentBidId].amount;

                if (currentBidAmount < minBidAmount) {
                    minBidAmount = currentBidAmount;
                    tiedCount = 1;
                    tiedBids[0] = currentBidId;
                } else if (currentBidAmount == minBidAmount) {
                    tiedBids[tiedCount] = currentBidId;
                    tiedCount++;
                }
            }

            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) %
                tiedCount;
            evaluatedbids[_projectId] = true;
            winnerBidId = tiedBids[randomIndex];
            bondWinners[_projectId] = winnerBidId;
            return;
        } else if (pj.projectType == ProjectClassfication.MaxRate) {
            uint256 maxBidAmount = 0;
            uint256[] memory tiedBids = new uint256[](bidIds.length);
            uint256 tiedCount = 0;

            for (uint256 i = 0; i < bidIds.length; i++) {
                uint256 currentBidId = bidIds[i];
                uint256 currentBidAmount = bids[currentBidId].amount;

                if (currentBidAmount > maxBidAmount) {
                    maxBidAmount = currentBidAmount;
                    tiedCount = 1;
                    tiedBids[0] = currentBidId;
                } else if (currentBidAmount == maxBidAmount) {
                    tiedBids[tiedCount] = currentBidId;
                    tiedCount++;
                }
            }

            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) %
                tiedCount;
            evaluatedbids[_projectId] = true;
            winnerBidId = tiedBids[randomIndex];
            bondWinners[_projectId] = winnerBidId;
            return;
        } else {
            revert("Unsupported project type");
        }
    }
    function awardBond(uint256 _projectId, uint256 bidWinner) public payable nonReentrant returns (uint256 _bidWiner) {
        bondCount++;
        Bid storage bd = bids[bidWinner];
        Project storage pj = projects[_projectId];

        require(pj.posted == true, "Project Not Posted");
        require(msg.sender == pj.creator, "Only project creator can award bond");
        require(msg.value == bd.amount, "Must send full bid amount");
        require(!bidders[bidderIds[bd.bidder]].blacklisted, "Selected bidder is blacklisted");

        // Bond storage with mappings
        bondObligor[bondCount] = bd.bidder;
        bondProjectId[bondCount] = _projectId;
        bondStatus[bondCount] = ProjectStatus.Approved;
        bondCompletion[bondCount] = ProjectCompletion.Signed;
        bondAmount[bondCount] = bd.amount;

        // Calculate and transfer initial 20% payment
        uint256 initialPayment = (bd.amount * 20) / 100;
        payable(bd.bidder).transfer(initialPayment);

        // Mark bid as accepted
        bd.accepted = true;

        emit BondAwarded(_projectId, bd.bidder, bd.amount, initialPayment);
        _createLog(_projectId, "BOND_AWARDED");

        pj.posted = false;
        return bidWinner;
    }

    // Auditor approval for milestone
    function approveCompletion(uint256 _bondId, ProjectCompletion _milestone) public {
        require(bondObligor[_bondId] != address(0), "Bond does not exist");
        require(bondStatus[_bondId] == ProjectStatus.Approved, "Project not in approved state");

        Project storage project = projects[bondProjectId[_bondId]];
        require(msg.sender == project.auditor, "Only assigned auditor can approve");
        require(_milestone > bondCompletion[_bondId], "Invalid milestone");

        // Mark this milestone as approved
        bondMilestoneApproved[_bondId][_milestone] = true;

        emit AuditorApproval(_bondId, _milestone);
        _createLog(bondProjectId[_bondId], "MILESTONE_APPROVED");
        // return true;
    }

    // Modified payment release with auditor verification requirement
    function releasePayment(uint256 _bondId, ProjectCompletion _newCompletion) public nonReentrant {
        require(bondObligor[_bondId] != address(0), "Bond does not exist");
        require(bondStatus[_bondId] != ProjectStatus.Completed, "Project already completed");
        require(bondStatus[_bondId] != ProjectStatus.Disputed, "Project is disputed");

        Project storage project = projects[bondProjectId[_bondId]];

        // Verify permissions and completion status
        require(msg.sender == project.creator, "Only project creator can release payment");
        require(_newCompletion > bondCompletion[_bondId], "Invalid completion status");

        // If there's an auditor, they must have approved this milestone
        if (project.hasAuditor) {
            require(bondMilestoneApproved[_bondId][_newCompletion], "Milestone not approved by auditor yet");
        }

        // Calculate payment due based on milestone difference
        uint256 previousPercentage = getCompletionPercentage(bondCompletion[_bondId]);
        uint256 newPercentage = getCompletionPercentage(_newCompletion);
        uint256 paymentDue = (bondAmount[_bondId] * (newPercentage - previousPercentage)) / 100;

        // Update completion status first
        bondCompletion[_bondId] = _newCompletion;

        // Update bond status if project is completed
        if (_newCompletion == ProjectCompletion.Full) {
            bondStatus[_bondId] = ProjectStatus.Completed;
            // Update reputation score for successful completion
            uint256 bidderId = bidderIds[bondObligor[_bondId]];
            bidders[bidderId].reputationScore += 1;
        }

        // Transfer milestone payment
        payable(bondObligor[_bondId]).transfer(paymentDue);

        emit PaymentReleased(_bondId, paymentDue, _newCompletion);
        _createLog(bondProjectId[_bondId], "PAYMENT_RELEASED");
    }

    // Enhanced dispute resolution
    function createDispute(uint256 _bondId, string memory _evidence) public {
        require(bondObligor[_bondId] != address(0), "Bond does not exist");
        require(bondStatus[_bondId] == ProjectStatus.Approved, "Invalid bond status");

        Project storage project = projects[bondProjectId[_bondId]];
        require(
            msg.sender == project.creator || msg.sender == bondObligor[_bondId],
            "Only project creator or obligor can create dispute"
        );

        disputeCount++;
        disputes[disputeCount] = Dispute({
            disputeId: disputeCount,
            bondId: _bondId,
            creator: msg.sender,
            mediator: address(0),
            evidence: _evidence,
            resolved: false,
            outcome: DisputeOutcome.Pending
        });

        bondStatus[_bondId] = ProjectStatus.Disputed;

        _createLog(bondProjectId[_bondId], "DISPUTE_CREATED");
    }

    // Assign mediator to a dispute
    function assignMediator(uint256 _disputeId, address _mediator) public onlyOwner {
        Dispute storage dispute = disputes[_disputeId];
        require(!dispute.resolved, "Dispute already resolved");
        require(dispute.mediator == address(0), "Mediator already assigned");

        dispute.mediator = _mediator;
        emit MediatorAssigned(_disputeId, _mediator);
        _createLog(bondProjectId[dispute.bondId], "MEDIATOR_ASSIGNED");
    }

    // Resolve dispute
    function resolveDispute(uint256 _disputeId, DisputeOutcome _outcome) public {
        Dispute storage dispute = disputes[_disputeId];
        require(msg.sender == dispute.mediator, "Only assigned mediator can resolve");
        require(!dispute.resolved, "Dispute already resolved");

        dispute.resolved = true;
        dispute.outcome = _outcome;

        // Handle dispute resolution effects
        if (_outcome == DisputeOutcome.RuledForCreator) {
            // Penalize the obligor
            uint256 bidderId = bidderIds[bondObligor[dispute.bondId]];
            if (bidders[bidderId].reputationScore > 0) {
                bidders[bidderId].reputationScore -= 1;
            }
        } else if (_outcome == DisputeOutcome.RuledForObligor) {
            // Allow obligor to continue work
            bondStatus[dispute.bondId] = ProjectStatus.Approved;
        }

        emit DisputeResolved(_disputeId, _outcome);
        _createLog(bondProjectId[dispute.bondId], "DISPUTE_RESOLVED");
    }
    function getAllProjects() public view returns (Project[] memory) {
        Project[] memory allProjects = new Project[](projectId);
        for (uint256 i = 0; i < projectId; i++) {
            allProjects[i] = projects[i + 1]; // projectId starts from 1
        }
        return allProjects;
    }
    function getProjectById(
        uint256 _projectId
    )
        public
        view
        returns (
            string memory title,
            uint256 budget,
            string memory description,
            uint256 deadline,
            bool posted,
            uint256 Id,
            ProjectClassfication projectType,
            address creator,
            uint256 timePeriod
        )
    {
        require(_projectId <= projectId, "Project does not exist");
        Project memory project = projects[_projectId];

        return (
            project.title,
            project.budget,
            project.description,
            project.deadline,
            project.posted,
            project.projectId,
            project.projectType,
            project.creator,
            project.timePeriod
        );
    }
    function getAllActiveProjects() public view returns (Project[] memory) {
        uint256 count = 0;
        // Count active projects
        for (uint256 i = 1; i <= projectId; i++) {
            if (projects[i].posted) {
                count++;
            }
        }
        Project[] memory activeProjects = new Project[](count);
        uint256 j = 0;
        // Collect active projects
        for (uint256 i = 1; i <= projectId; i++) {
            if (projects[i].posted) {
                activeProjects[j] = projects[i];
                j++;
            }
        }
        return activeProjects;
    }
    function getBidsByUser(address _bidder) public view returns (Bid[] memory) {
        // First, count the number of bids by this user
        uint256 count = 0;
        for (uint256 i = 1; i <= bidCount; i++) {
            if (bids[i].bidder == _bidder) {
                count++;
            }
        }

        // Create array of correct size
        Bid[] memory userBids = new Bid[](count);
        uint256 currentIndex = 0;

        // Collect all bids by the user
        for (uint256 i = 1; i <= bidCount; i++) {
            if (bids[i].bidder == _bidder) {
                userBids[currentIndex] = bids[i];
                currentIndex++;
            }
        }

        return userBids;
    }
    function getProjectsByCreator(address _creator) public view returns (Project[] memory) {
        // First, count the number of projects by this creator
        uint256 count = 0;
        for (uint256 i = 1; i <= projectId; i++) {
            if (projects[i].creator == _creator) {
                count++;
            }
        }

        // Create array of correct size and populate it
        Project[] memory creatorProjects = new Project[](count);
        uint256 currentIndex = 0;

        // Collect all projects by creator
        for (uint256 i = 1; i <= projectId; i++) {
            if (projects[i].creator == _creator) {
                creatorProjects[currentIndex] = projects[i];
                currentIndex++;
            }
        }

        return creatorProjects;
    }
    // Get Project Bid Winner
    function getProjectBidWinner(uint256 _projectId) public view returns (uint256 _bidWinnerId) {
        // Project storage pj = projects[_projectId];
        require(evaluatedbids[_projectId] == true, "Bid Not Evaluated");
        // require(msg.sender == pj.creator, "You are Not Authothorized");
        require(_projectId <= projectId, "Invalid ProjectId");
        return bondWinners[_projectId];
    }
    // Get transparency logs for a project
    function getProjectLogs(uint256 _projectId) public view returns (LogEntry[] memory) {
        return transparencyLogs[_projectId];
    }

    function getCompletionPercentage(ProjectCompletion _completion) public pure returns (uint256) {
        // Return percentages based on completion stage
        if (_completion == ProjectCompletion.Signed) return 20; // Initial 20%
        if (_completion == ProjectCompletion.Quarter) return 40; // +20%
        if (_completion == ProjectCompletion.Half) return 60; // +20%
        if (_completion == ProjectCompletion.ThreeQuarters) return 80; // +20%
        if (_completion == ProjectCompletion.Full) return 100; // Final 20%
        return 0;
    }
    // Function to get the current completion level of a bond
    function getCompletionLevel(uint256 _bondId) public view returns (ProjectCompletion) {
        require(bondObligor[_bondId] != address(0), "Bond does not exist");
        return bondCompletion[_bondId];
    }

    // Removed simple dispute function which is now replaced by more comprehensive dispute resolution system

    // Using OpenZeppelin's ReentrancyGuard instead of custom nonReentrant modifier

    receive() external payable {}
}
