// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ContractHash{

    uint256 public count; // number of files stored in the blockchain

    struct File {
        uint256 serialNo;
        string Hash;
        string FileName;
    }

    event FileUploadedEvent(string action);
    event FileAlreadyExistsEvent(string action);

    mapping (uint256 => File) HashList; // mapping to retrive a hash from serial number
    mapping (string => uint256) FileNoList; // mapping to retrive the serial number from the hash
    mapping (uint256 => address) OwnerOf; //mapping the serial number to the owner of the file
    // using bidirectional mapping to ensure that hash and serial number can be retrieved at any time

    constructor() {
        count = 0;
    }

    function getHash(uint256 fileNo) public view returns (string memory){
        return HashList[fileNo].Hash;
    }

    function getFileName(uint256 fileNo) public view returns (string memory){
        return HashList[fileNo].FileName;
    }

    function getOwner(uint256 fileNo) public view returns (address){
        return OwnerOf[fileNo];
    }

    function getFileNo(string memory Hash) public view returns (uint256){
        return FileNoList[Hash];
    }

    function checkFile(string memory Hash) public view returns (bool){
        if(FileNoList[Hash] > 0) return true;
        else return false;
    }

    function uploadFile(string memory fileHash, string memory fileName) public {
        //uploading the hash only if the file hasn't already been uploaded
        if(checkFile(fileHash)==false && OwnerOf[getFileNo(fileHash)] !=  msg.sender){
            HashList[count+1] = File(count+1,fileHash,fileName);
            OwnerOf[count+1] = msg.sender;
            FileNoList[fileHash] = count+1;
            count++;
            emit FileUploadedEvent("File Uploaded Successfully");
        }
        else {
            emit FileAlreadyExistsEvent("File Already Exists in Blockchain");
        }
    }
}