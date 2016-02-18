'use strict';

//Load dependencies
let chai = require('chai');
let dirtyChai = require('dirty-chai');
let chaiAsPromised = require('chai-as-promised');

//Enable should assertion style for usage with chai-as-promised
chai.should();

//Extend chai
chai.use(dirtyChai);
chai.use(chaiAsPromised);

//Expose globals
global.expect = chai.expect;
