//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// Custom errors to reduce contract size
error InvalidBidId();
error InvalidRiskScore();
error BidDoesNotExist();
error ProjectDoesNotExist();
error BidAlreadyEvaluated();
error NoBidsAvailable();
error NoLowRiskBidsAvailable();
error BidderAlreadyExists();
error BidderBlacklisted();
error AddressBlacklisted();
error EmptyDescription();
error EmptyTitle();
error InvalidTimePeriod();
error InvalidBudget();
error NoAuditorsAvailable();
error AuditorAlreadyAssigned();
error AuditorNotRegistered();
error AlreadyBidded();
error CreatorCannotBid();
error BidderDoesNotExist();
error ProjectNotPosted();
error ProjectLate();
error InvalidAmount();
error OnlyCreatorCanAward();
error MustSendFullAmount();
error SelectedBidderBlacklisted();
error BondDoesNotExist();
error ProjectNotApproved();
error OnlyAuditorCanApprove();
error InvalidMilestone();
error ProjectAlreadyCompleted();
error ProjectDisputed();
error OnlyCreatorCanRelease();
error InvalidCompletionStatus();
error MilestoneNotApproved();
error OnlyCreatorOrObligorCanDispute();
error DisputeAlreadyResolved();
error MediatorAlreadyAssigned();
error OnlyMediatorCanResolve();
error InvalidProjectId();
error BidNotEvaluated();

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
    // ML Risk Assessment events
    event RiskAssessmentSubmitted(uint256 indexed bidId, address indexed bidder, uint256 riskScore, string riskCategory);
    event MLRecommendationUpdated(uint256 indexed bidId, string recommendation, bool approved);

    uint256 public version = 4;
    uint256 public projectId = 0;
    uint256 public bidCount = 0;
    uint256 public bondCount = 0;
    uint256 public disputeCount = 0;
    
    // ML Risk Assessment tracking
    mapping(uint256 => RiskAssessment) public bidRiskAssessments; // bidId => RiskAssessment
    mapping(address => uint256[]) public bidderRiskHistory; // bidder => array of risk scores
    mapping(address => uint256) public bidderAverageRisk; // bidder => average risk score

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
    
    struct RiskAssessment {
        uint256 bidId;
        address bidder;
        uint256 riskScore; // 0-100 scale
        string riskCategory; // "Low", "Medium", "High"
        string recommendation;
        uint256 timestamp;
        bool approved;
        string mlModelVersion;
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
        if (approvedAuditors[_auditor]) revert AuditorAlreadyAssigned();
        approvedAuditors[_auditor] = true;
        approvedAuditorsList.push(_auditor);
    }

    function removeAuditor(address _auditor) public onlyOwner {
        if (!approvedAuditors[_auditor]) revert AuditorNotRegistered();
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
        if (bidderIds[msg.sender] != 0) revert BidderAlreadyExists();
        if (bidders[bidderIds[msg.sender]].blacklisted) revert AddressBlacklisted();
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
        if (bytes(_description).length == 0) revert EmptyDescription();
        if (bytes(_title).length == 0) revert EmptyTitle();
        if (_timeperiod == 0) revert InvalidTimePeriod();
        if (_budget == 0) revert InvalidBudget();

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
        if (msg.sender != project.creator) revert OnlyCreatorCanAward();
        if (approvedAuditorsList.length == 0) revert NoAuditorsAvailable();
        if (project.hasAuditor) revert AuditorAlreadyAssigned();

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
    
    // ML Risk Assessment Functions
    
    /**
     * @dev Submit ML risk assessment for a bid
     * @param _bidId The ID of the bid to assess
     * @param _riskScore Risk score from 0-100
     * @param _riskCategory Risk category (Low/Medium/High)
     * @param _recommendation ML recommendation
     * @param _mlModelVersion Version of ML model used
     */
    function submitRiskAssessment(
        uint256 _bidId,
        uint256 _riskScore,
        string memory _riskCategory,
        string memory _recommendation,
        string memory _mlModelVersion
    ) public {
        if (_bidId == 0 || _bidId > bidCount) revert InvalidBidId();
        if (_riskScore > 100) revert InvalidRiskScore();
        if (bids[_bidId].bidId != _bidId) revert BidDoesNotExist();
        
        address bidder = bids[_bidId].bidder;
        
        // Create risk assessment
        RiskAssessment memory assessment = RiskAssessment({
            bidId: _bidId,
            bidder: bidder,
            riskScore: _riskScore,
            riskCategory: _riskCategory,
            recommendation: _recommendation,
            timestamp: block.timestamp,
            approved: _riskScore < 70, // Auto-approve if risk < 70
            mlModelVersion: _mlModelVersion
        });
        
        bidRiskAssessments[_bidId] = assessment;
        
        // Update bidder risk history
        bidderRiskHistory[bidder].push(_riskScore);
        
        // Update average risk score
        uint256[] memory history = bidderRiskHistory[bidder];
        uint256 totalRisk = 0;
        for (uint256 i = 0; i < history.length; i++) {
            totalRisk += history[i];
        }
        bidderAverageRisk[bidder] = totalRisk / history.length;
        
        emit RiskAssessmentSubmitted(_bidId, bidder, _riskScore, _riskCategory);
        
        // Auto-update recommendation if high risk
        if (_riskScore >= 70) {
            emit MLRecommendationUpdated(_bidId, _recommendation, false);
        }
    }
    
    /**
     * @dev Get risk assessment for a specific bid
     * @param _bidId The ID of the bid
     * @return riskScore The risk score (0-100)
     * @return riskCategory The risk category (Low/Medium/High)
     * @return recommendation The ML recommendation
     * @return timestamp When the assessment was created
     * @return approved Whether the assessment was approved
     * @return mlModelVersion The version of the ML model used
     */
    function getRiskAssessment(uint256 _bidId) public view returns (
        uint256 riskScore,
        string memory riskCategory,
        string memory recommendation,
        uint256 timestamp,
        bool approved,
        string memory mlModelVersion
    ) {
        RiskAssessment memory assessment = bidRiskAssessments[_bidId];
        return (
            assessment.riskScore,
            assessment.riskCategory,
            assessment.recommendation,
            assessment.timestamp,
            assessment.approved,
            assessment.mlModelVersion
        );
    }
    
    /**
     * @dev Get bidder's average risk score
     * @param _bidder The bidder's address
     * @return Average risk score
     */
    function getBidderAverageRisk(address _bidder) public view returns (uint256) {
        return bidderAverageRisk[_bidder];
    }
    
    /**
     * @dev Get bidder's risk history
     * @param _bidder The bidder's address
     * @return Array of risk scores
     */
    function getBidderRiskHistory(address _bidder) public view returns (uint256[] memory) {
        return bidderRiskHistory[_bidder];
    }
    
    /**
     * @dev Override bid evaluation to include ML risk assessment
     * @param _projectId The project ID
     */
    function bidEvaluationWithML(uint256 _projectId) public {
        Project storage pj = projects[_projectId];
        if (!pj.posted) revert ProjectNotPosted();
        if (projects[_projectId].creator == address(0)) revert ProjectDoesNotExist();
        if (evaluatedbids[_projectId]) revert BidAlreadyEvaluated();
        
        uint256[] memory bidIds = projectBids[_projectId];
        if (bidIds.length == 0) revert NoBidsAvailable();
        
        // Filter bids based on ML risk assessment
        uint256[] memory lowRiskBids = new uint256[](bidIds.length);
        uint256 lowRiskCount = 0;
        
        for (uint256 i = 0; i < bidIds.length; i++) {
            uint256 bidId = bidIds[i];
            RiskAssessment memory assessment = bidRiskAssessments[bidId];
            
            // Only consider bids with low or medium risk
            if (assessment.riskScore < 70) {
                lowRiskBids[lowRiskCount] = bidId;
                lowRiskCount++;
            }
        }
        
        if (lowRiskCount == 0) revert NoLowRiskBidsAvailable();
        
        // Evaluate remaining bids using original logic
        uint256 winnerBidId = 0;
        
        if (pj.projectType == ProjectClassfication.MinRate) {
            uint256 minBidAmount = type(uint256).max;
            uint256[] memory tiedBids = new uint256[](lowRiskCount);
            uint256 tiedCount = 0;
            
            for (uint256 i = 0; i < lowRiskCount; i++) {
                uint256 currentBidId = lowRiskBids[i];
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
            
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % tiedCount;
            winnerBidId = tiedBids[randomIndex];
        } else if (pj.projectType == ProjectClassfication.MaxRate) {
            uint256 maxBidAmount = 0;
            uint256[] memory tiedBids = new uint256[](lowRiskCount);
            uint256 tiedCount = 0;
            
            for (uint256 i = 0; i < lowRiskCount; i++) {
                uint256 currentBidId = lowRiskBids[i];
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
            
            uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % tiedCount;
            winnerBidId = tiedBids[randomIndex];
        } else if (pj.projectType == ProjectClassfication.FixRate) {
            uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
            winnerBidId = lowRiskBids[random % lowRiskCount];
        }
        
        evaluatedbids[_projectId] = true;
        bondWinners[_projectId] = winnerBidId;
        
        _createLog(_projectId, "BID_EVALUATED_WITH_ML");
    }

    // Rest of existing functions with security and anti-corruption enhancements

    function createBid(uint256 _projectId, string memory _proposalIPFHash, uint256 _amount) public {
        Project storage pj = projects[_projectId];
        Bidder storage bidder = bidders[bidderIds[msg.sender]];

        // Add check for existing bid from this address
        if (hasBidded[msg.sender][_projectId]) revert AlreadyBidded();

        if (bidder.blacklisted) revert BidderBlacklisted();
        if (pj.creator == msg.sender) revert CreatorCannotBid();
        if (bidderIds[msg.sender] == 0) revert BidderDoesNotExist();
        if (!pj.posted) revert ProjectNotPosted();
        if (projects[_projectId].creator == address(0)) revert ProjectDoesNotExist();
        if (isProjectLate(_projectId)) revert ProjectLate();

        bidCount++;
        if (pj.projectType == ProjectClassfication.FixRate) {
            if (_amount != pj.budget) revert InvalidAmount();
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
        if (!pj.posted) revert ProjectNotPosted();
        if (projects[_projectId].creator == address(0)) revert ProjectDoesNotExist();
        if (evaluatedbids[_projectId]) revert BidAlreadyEvaluated();
        uint256[] memory bidIds = projectBids[_projectId];
        if (bidIds.length == 0) revert NoBidsAvailable();
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

        if (!pj.posted) revert ProjectNotPosted();
        if (msg.sender != pj.creator) revert OnlyCreatorCanAward();
        if (msg.value != bd.amount) revert MustSendFullAmount();
        if (bidders[bidderIds[bd.bidder]].blacklisted) revert SelectedBidderBlacklisted();

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
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        if (bondStatus[_bondId] != ProjectStatus.Approved) revert ProjectNotApproved();

        Project storage project = projects[bondProjectId[_bondId]];
        if (msg.sender != project.auditor) revert OnlyAuditorCanApprove();
        if (_milestone <= bondCompletion[_bondId]) revert InvalidMilestone();

        // Mark this milestone as approved
        bondMilestoneApproved[_bondId][_milestone] = true;

        emit AuditorApproval(_bondId, _milestone);
        _createLog(bondProjectId[_bondId], "MILESTONE_APPROVED");
        // return true;
    }

    // Modified payment release with auditor verification requirement
    function releasePayment(uint256 _bondId, ProjectCompletion _newCompletion) public nonReentrant {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        if (bondStatus[_bondId] == ProjectStatus.Completed) revert ProjectAlreadyCompleted();
        if (bondStatus[_bondId] == ProjectStatus.Disputed) revert ProjectDisputed();

        Project storage project = projects[bondProjectId[_bondId]];

        // Verify permissions and completion status
        if (msg.sender != project.creator) revert OnlyCreatorCanRelease();
        if (_newCompletion <= bondCompletion[_bondId]) revert InvalidCompletionStatus();

        // If there's an auditor, they must have approved this milestone
        if (project.hasAuditor) {
            if (!bondMilestoneApproved[_bondId][_newCompletion]) revert MilestoneNotApproved();
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
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        if (bondStatus[_bondId] != ProjectStatus.Approved) revert ProjectNotApproved();

        Project storage project = projects[bondProjectId[_bondId]];
        if (msg.sender != project.creator && msg.sender != bondObligor[_bondId]) revert OnlyCreatorOrObligorCanDispute();

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
        if (dispute.resolved) revert DisputeAlreadyResolved();
        if (dispute.mediator != address(0)) revert MediatorAlreadyAssigned();

        dispute.mediator = _mediator;
        emit MediatorAssigned(_disputeId, _mediator);
        _createLog(bondProjectId[dispute.bondId], "MEDIATOR_ASSIGNED");
    }

    // Resolve dispute
    function resolveDispute(uint256 _disputeId, DisputeOutcome _outcome) public {
        Dispute storage dispute = disputes[_disputeId];
        if (msg.sender != dispute.mediator) revert OnlyMediatorCanResolve();
        if (dispute.resolved) revert DisputeAlreadyResolved();

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
        if (_projectId > projectId) revert InvalidProjectId();
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
        if (!evaluatedbids[_projectId]) revert BidNotEvaluated();
        // require(msg.sender == pj.creator, "You are Not Authothorized");
        if (_projectId > projectId) revert InvalidProjectId();
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
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondCompletion[_bondId];
    }
    
    // Public getter functions for bond data
    function getBondStatus(uint256 _bondId) public view returns (ProjectStatus) {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondStatus[_bondId];
    }
    
    function getBondObligor(uint256 _bondId) public view returns (address) {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondObligor[_bondId];
    }
    
    function getBondAmount(uint256 _bondId) public view returns (uint256) {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondAmount[_bondId];
    }
    
    function getBondProjectId(uint256 _bondId) public view returns (uint256) {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondProjectId[_bondId];
    }
    
    function isMilestoneApproved(uint256 _bondId, ProjectCompletion _milestone) public view returns (bool) {
        if (bondObligor[_bondId] == address(0)) revert BondDoesNotExist();
        return bondMilestoneApproved[_bondId][_milestone];
    }

    // Removed simple dispute function which is now replaced by more comprehensive dispute resolution system

    // Using OpenZeppelin's ReentrancyGuard instead of custom nonReentrant modifier

    receive() external payable {}
}
