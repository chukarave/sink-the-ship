"use strict";

var spielfeld = new Array(10);
var i, j;

//create field two dimensional array
for (i = 0; i < 10; i++) {
    spielfeld[i] = new Array(10)
        for (j = 0; j < 10; j++)
        {
            spielfeld[i][j] = false;
        }
}

// create field as string with . and #
function renderField() {
    var field = document.getElementById("field");
    field.innerHTML = "";
    var x,y;
    var element;
    for (y = 0; y < spielfeld.length; y++) {
        for (x = 0; x < spielfeld[y].length; x++) {
            element = document.createElement("div");
            element.setAttribute("class", "ship");
            element.setAttribute("data-x", x);
            element.setAttribute("data-y", y);
            if (spielfeld[y][x]) {
                element.style.backgroundColor = "red";
            } else {
                element.style.backgroundColor = "blue";
            }
            field.appendChild(element);
            element.addEventListener("click", handleClick);
        }
    }
}

// if clicked point is part of a ship, paint green
function handleClick(e) {
      var intx, inty;
      var point_obj;

      console.log(e.target.getAttribute("data-x"), e.target.getAttribute("data-y"));

      intx = parseInt(e.target.getAttribute("data-x"), 10);
      inty = parseInt(e.target.getAttribute("data-y"), 10);
      point_obj = {
             x: intx,
             y: inty
      }
      if (checkPointConent(point_obj)) {
        e.target.style.backgroundColor = "green";
      }
}

// check if point is ship or water
function checkPointConent(p) {
    if (spielfeld[p.y][p.x]) {
    return true;
    } else {
    return false;
    }
}


// all possible directions from one point (right, down, left, up)
var directions = [
{
    dx: 1,
        dy: 0
},
{
    dx: 0,
    dy: 1
},
{
    dx: -1,
    dy: 0
},
{
    dx: 0,
    dy: -1
}
];

// gives an array of objects representing the four possible routes around the point
function ship(point, direction, slength) {
    var i;
    var possible_route = [];

    for (i = 0; i < slength; i++) {
        possible_route.push(
                {
                    x: point.x + i * direction.dx,
                    y: point.y + i * direction.dy
                }
        )
    }
    // array of arrays of objects - [[{point a},{point b}], [{point a},{point b}]]
    return possible_route;
}

// point is false when:
// if the given point lies outside the array borders
// if the given point is true == occupied
function check_point(p) {
    if (p.x < 0 || p.x > 9) {
        return false;
    } else if (p.y < 0 || p.y > 9) {
        return false;
    } else if (spielfeld[p.y][p.x]) {
        //console.log("point already in use:", p);
        return false;
    } else {
        //console.log("point ok:", p);
        return true;
    }
}

// creates the ship array
function createShip(slength) {
    // generate a random point on the field
    var point = {
        x: Math.floor(Math.random() * (9 - 0 + 1)),
        y: Math.floor(Math.random() * (9 - 0 + 1))
    }

    // generate an array of four ships.
    // Each ship is an array of points on the field, depending on the ship's length
    var ships = directions.map(function (d) {
        return ship(point, d, slength)
    });

    // returns an array of arrays
    // Each array represents a valid ship.
    var valid_ships = ships.filter(function(s) {
        var i, p;
        var ok = true;
        // the four directions around each point in the length of the ship are checked.
        for (i = 0; i < s.length; i++) {
            p = s[i];
            // ok has to be assigned to ok again, so that its 'true' value will be renewed.
            ok = ok && check_point(p) &&
                check_point({x: p.x, y: p.y + 1}) &&
                check_point({x: p.x, y: p.y - 1}) &&
                check_point({x: p.x + 1, y: p.y}) &&
                check_point({x: p.x - 1, y: p.y});
        }

        return ok;
    })

    // if more than 1 direction is returned valid, choose randomely.
    if (valid_ships.length >= 1) {
        return valid_ships[Math.floor(Math.random() * valid_ships.length)];
    // if no direction is returned valid, start over with the same ship length.
    } else if (valid_ships.length === 0 ) {
        return createShip(slength)
    }

}

// set all the elements representing the ship in the
// field array as true.
function place_ship(ship) {
    for (var i = 0; i < ship.length; i++) {
        spielfeld[ship[i].y][ship[i].x] = true;
    }
}

place_ship(createShip(2));
place_ship(createShip(3));
place_ship(createShip(4));
place_ship(createShip(5));

renderField();
