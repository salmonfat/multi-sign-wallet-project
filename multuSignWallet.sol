pragma solidity ^0.8.0;

contract multiSign{
    event received(address _from,uint value, bytes _date);
    event caseAdded(uint id);

    mapping(address=>bool)public isMenber;
    mapping(address=>mapping(uint=>bool))public checkConfirm;// address=>id=>confirmed
    mapping(address=>bool)changeMemberLock;
    _Case[] public theCases;
    uint public memberCount;
    struct _Case{
        uint id;
        address target;
        uint amount;
        uint agree;
        bool done;
    }

    constructor()payable{
        isMenber[msg.sender]=true;
        memberCount=1;
    }
    function addCase(address _traget,uint _amount)external isMember{
        require(_amount>0,"invalid value");
        require(_traget!=address(0),"invalid address");
        uint _id=theCases.length;
        _Case memory newCase=_Case(_id,_traget,_amount,0,false);
        theCases.push(newCase);
        emit caseAdded(_id);
    }
    function confirm(uint _id)external isMember{
        require(theCases[_id].done==false,"already executed.");
        require(checkConfirm[msg.sender][_id]==false,"you already confirmed");
        checkConfirm[msg.sender][_id]=true;
        theCases[_id].agree++;
    }
    function revoke(uint _id)external isMember{
        require(theCases[_id].done==false,"already executed.");
        require(checkConfirm[msg.sender][_id]==true,"you haven't confirmed");
        checkConfirm[msg.sender][_id]=false;
        theCases[_id].agree--;
    }
    function execute(uint _id)external isMember{
        require(theCases[_id].done==false,"already executed.");
        require(theCases[_id].agree>=memberCount/2,"not enought agree");//must more than half people agree
        if(theCases[_id].amount!=0){
            theCases[_id].done=true;
            payable(theCases[_id].target).transfer(theCases[_id].amount);
        }else{
            if(isMenber[theCases[_id].target]==false){
            isMenber[theCases[_id].target]=true;
            memberCount++;
            theCases[_id].done=true;
            }else{
            isMenber[theCases[_id].target]=false;
            memberCount--;
            theCases[_id].done=true;
            require(memberCount>1,"members can not be less than 2");
            }
            changeMemberLock[theCases[_id].target]=false;  
        }
    }
    function addMemberCase(address newMember)external isMember{
        require(newMember!=address(0),"invalid address");
        require(isMenber[newMember]==false,"already is member.");
        require(changeMemberLock[newMember]==false,"can not propose adding same people twice");
        changeMemberLock[newMember]=true;
        uint _id=theCases.length;
        _Case memory newCase=_Case(_id,newMember,0,0,false);
        theCases.push(newCase);
        emit caseAdded(_id);
    }
    function deleteMemberCase(address deleted)external isMember{
        require(isMenber[deleted]==true,"selected address is not member");
        require(changeMemberLock[deleted]==false,"can not propose deleting same people twice");
        changeMemberLock[deleted]=true;
        uint _id=theCases.length;
        _Case memory newCase=_Case(_id,deleted,0,0,false);
        theCases.push(newCase);
        emit caseAdded(_id);
    }
    fallback()external payable{
        emit received(msg.sender,msg.value,msg.data);
    }
    receive()external payable{
        emit received(msg.sender,msg.value,"");
    }
    modifier isMember(){
        require(isMenber[msg.sender]==true,"you are not member.");
        _;
    }
    function checkTotalBalance()external view returns(uint){
        return address(this).balance;
    }
}