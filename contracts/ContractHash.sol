// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ContractHash{

    uint256 public count; // number of files stored in the blockchain
    mapping (uint256 => string) HashList; // mapping to retrive a hash from serial number
    mapping (string => uint256) FileNoList; // mapping to retrive the serial number from the hash
    // using bidirectional mapping to ensure that hash and serial number can be retrieved at any time

    constructor() {
        count = 0;
    }

    event FileUploadedEvent(string action, address uploader);

    function getHash(uint256 fileNo) public view returns (string memory){
        return HashList[fileNo];
    }

    function getFileNo(string memory Hash) public view returns (uint256){
        return FileNoList[Hash];
    }

    function checkFile(string memory Hash) public view returns (bool){
        if(FileNoList[Hash] > 0) return true;
        else return false;
    }

    function uploadFile(string memory fileHash) public {
        HashList[count+1] = fileHash;
        FileNoList[fileHash] = count+1;
        count++;
        emit FileUploadedEvent("File Uploaded", msg.sender);
    }
}