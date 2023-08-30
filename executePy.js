const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { stdout, stderr } = require('process');


const executePy = (code) =>{
 return new Promise((resolve,reject)=>{
    exec(
        `python ${filepath}`,
        (error,stdout,stderr)=>{
           error && reject ({error , stderr});
           stderr && reject((stderr));
           resolve(stdout)

        }
    )
 })
}

module.exports = {
  
    executePy,
};
