var Vec2 = function(x,y) {
	this.x = x;
	this.y = y;

	//function getX(){ return x; }
	//function getY(){ return y; }
};

Vec2.prototype.getLength = function(){
	return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
}

function vec2Fract(v){
	var x = Math.ceil(((v.x < 1.0) ? v.x : (v.x % Math.floor(v.x))) * 1);
	var y = Math.ceil(((v.y < 1.0) ? v.y : (v.y % Math.floor(v.y))) * 1);

	return new Vec2(x,y);
}

function scalarFract(f){
	return Math.ceil(((f < 1.0) ? f : (f % Math.floor(f)) * 10000));
}

function hash(p) {
	var h = vec2DotProduct(p, new Vec2(127.1,311.7));	
    return scalarFract(Math.sin(h)*43758.5453123);
}

function mix(p1, p2, a){
	var v1 = p1*(1-a);
	var v2 = p2*a;

	return (v1+v2)/2;
}

function vec2mix(p1, p2, a){
	var v1 = new Vec2(p1.x*(1-a), p1.y*(1-a));
	var v2 = new Vec2(p2.x*a, p2.y*a);

	return new Vec2((v1.x+v2.x)/2, (v1.y+v2.y)/2);
}

function vec2ScalarProduct(v1, v2){
	return new Vec2(v1.x*v2.x, v1.y*v2.y);
}

function vec2DotProduct(v1, v2){
	return (v1.x*v2.x + v1.y*v2.y);
}

function vec2Multiply(scalar, vec){
	return new Vec2(scalar*vec.x, scalar*vec.y);
}

function vec2Subtract(v1, v2){
	return new Vec2(v1.x-v2.x, v2.y-v2.y);
}

function vec2Add(v1, v2){
	return new Vec2(v1.x+v2.x, v1.y+v2.y);
}

function noise(pos){
	var i = new Vec2(Math.floor(pos.x), Math.floor(pos.y));
	var f = vec2Fract(pos);
	var u = vec2ScalarProduct(
				vec2ScalarProduct(f,f), 
				vec2Subtract(
					new Vec2(3.0, 3.0), 
					vec2Multiply(2.0, f)
				)
			);

	return -1.0+2.0*mix( mix( hash( vec2Add(i, new Vec2(0.0,0.0) )), 
                     hash( vec2Add(i, new Vec2(1.0,0.0) )), u.x),
                mix( hash( vec2Add(i, new Vec2(0.0,1.0)) ), 
                     hash( vec2Add(i, new Vec2(1.0,1.0)) ), u.x), u.y);

}