/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_rocks   : [],
_bullets : [],
_ships   : [],

_bShowRocks : false,

// "PRIVATE" METHODS

_generateRocks : function() {
    var i,
	NUM_ROCKS = 4;

    //add 4 rocks
    for(i = 0; i<NUM_ROCKS; i++){
      this._rocks.push(new Rock());
    }
},

_findNearestShip : function(posX, posY) {


    //create a xWrap and yWrap variable so we can find the wrap distence
    //between mousepress position and a ship position
    var xWrap = util.wrapRange(this._ships[0].cx, 0 , g_canvas.width);
    var yWrap = util.wrapRange(this._ships[0].cy, 0 , g_canvas.height);

    //start by creating defult value for closestShip and closestIndex
    //so it is possable to compare the ships witch is closer
    var closestShip = this._ships[0];
    var closestIndex = 0;

    //the wrapped distence between mousepress and the ship, start by giving it
    //defult values
    var closestsq = util.wrappedDistSq(posX, posY, this._ships[0].cx,
                                      this._ships[0].cy, xWrap, yWrap);


    //check if the wrapped distence of next ship index is closer to mousepress
    //position then the last, if it is, update
    for(var i = 0; i< this._ships.length; i++){
      xWrap = util.wrapRange(this._ships[i].cx, 0 , g_canvas.width);
      yWrap = util.wrapRange(this._ships[0].cy, 0 , g_canvas.height);
      var newsq = util.wrappedDistSq(posX, posY, this._ships[i].cx,
                                    this._ships[i].cy, xWrap, yWrap );
      if(newsq < closestsq){
        closestShip = this._ships[i];
        closestIndex = i;
        closestsq = newsq;
      }
    }



    return {
	theShip : closestShip,   // the object itself
	theIndex: closestIndex   // the array index where it lives
    };
},

_forEachOf: function(aCategory, fn) {
    for (var i = 0; i < aCategory.length; ++i) {
	fn.call(aCategory[i]);
    }
},

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//
deferredSetup : function () {
    this._categories = [this._rocks, this._bullets, this._ships];
},

init: function() {
    this._generateRocks();

    // I could have made some ships here too, but decided not to.
    //this._generateShip();
},

fireBullet: function(cx, cy, velX, velY, rotation) {
    this._bullets.push(new Bullet({cx, cy, velX, velY, rotation}));




},

generateShip : function(descr) {
    // TODO: Implement this
    this._ships.push(new Ship(descr) );
},

killNearestShip : function(xPos, yPos) {
    //find the closest ship from your mousepress position
    var closestShip = this._findNearestShip(xPos, yPos);
    //remove the ship from the array and move all items to the left with splice
    this._ships.splice(closestShip.theIndex,1);

},

yoinkNearestShip : function(xPos, yPos) {
    //find the closest ship from your mousepress position
    var closestShip = this._findNearestShip(xPos, yPos);
    //update the xposition and yposition where the mousepress happens
    this._ships[closestShip.theIndex].cx = xPos;
    this._ships[closestShip.theIndex].cy = yPos;






},

resetShips: function() {
    this._forEachOf(this._ships, Ship.prototype.reset);
},

haltShips: function() {
    this._forEachOf(this._ships, Ship.prototype.halt);
},

toggleRocks: function() {
    this._bShowRocks = !this._bShowRocks;
},

update: function(du) {


    // TODO: Implement this

    // NB: Remember to handle the "KILL_ME_NOW" return value!
    //     and to properly update the array in that case.


    for (var c = 0; c < this._categories.length; ++c) {

      var aCategory = this._categories[c];

      for (var i = 0; i < aCategory.length; ++i) {

        aCategory[i].update(du);

            }
        }


},

render: function(ctx) {

    for (var c = 0; c < this._categories.length; ++c) {

        var aCategory = this._categories[c];

        for (var i = 0; i < aCategory.length; ++i) {
          //if we are looking at rocks and it is false, then we don't add them
          if(aCategory === this._rocks && this._bShowRocks===false){
            break;
          }

            aCategory[i].render(ctx);

        }
    }

}




}

// Some deferred setup which needs the object to have been created first
entityManager.deferredSetup();

entityManager.init();
