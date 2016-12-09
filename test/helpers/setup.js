'use strict';

//Load dependencies
const chai = require('chai');
const sinon = require('sinon');
const Promise = require('bluebird');
const dirtyChai = require('dirty-chai');
const chaiAsPromised = require('chai-as-promised');

//Load sinon extensions
require('sinon-mongoose');
require('sinon-as-promised')(Promise);

//Enable should assertion style for usage with chai-as-promised
chai.should();

//Extend chai
chai.use(dirtyChai);
chai.use(chaiAsPromised);

//Expose globals
global.expect = chai.expect;
global.sinon = sinon;
