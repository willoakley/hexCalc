class Hex {
	constructor(options) {
		if (typeof arguments[0] != "object") {
			options = { sideLength: 1.0 };
		}

		if (options.height !== undefined) {
			options.sideLength = Hex.SideLengthFromHeight(options.height * 1.0);
		}

		if (options.width !== undefined) {
			options.sideLength = Hex.SideLengthFromWidth(options.width * 1.0);
		}

		if (options.offsetWidth !== undefined) {
			options.sideLength = Hex.SideLengthFromSectionWidth(options.offsetWidth * 1.0);
		}

		if (options.offsetHeight !== undefined) {
			options.sideLength = Hex.SideLengthFromSectionHeight(options.offsetHeight * 1.0);
		}

		if (options.sideLength === undefined) {
			options.sideLength = 1.0;
		}
		else {
			options.sideLength *= 1.0;
		}

		this.side = options.sideLength * 1.00;

		this.r = Hex.CosThirtyDegrees * this.side;
		this.h = Hex.SinThirtyDegrees * this.side;
		
		this.sectionWidth = this.side + this.h;
		this.sectionHeight = this.r;
		
		this.width = this.side + 2.0 * this.h;
		this.height = 2.0 * this.r;
	}

	static get SinThirtyDegrees() { return 0.5000; }
	static get CosThirtyDegrees() { return 0.8660; }

	static SideLengthFromWidth(width) /* Point to point */ {
		return width / 2.00;
	}

	static SideLengthFromHeight(height) /* Edge to edge */ {
		return (height / 2.0) / Hex.CosThirtyDegrees;
	}

	static SideLengthFromSectionWidth(sectionWidth) {
		return sectionWidth * (2.0 / 3.0);
	}

	static SideLengthFromSectionHeight(sectionHeight) {
		return sectionHeight / Hex.CosThirtyDegrees;
	}

	hexPointsAtOffset(offset) {	
		offset = offset || { x: 0.0, y: 0.0 };
		
		return [ 
			{ x: offset.x + this.h,             y: offset.y },
			{ x: offset.x + this.h + this.side, y: offset.y },
			{ x: offset.x + this.width,         y: offset.y + this.r },
			{ x: offset.x + this.h + this.side, y: offset.y + this.height },
			{ x: offset.x + this.h,             y: offset.y + this.height },
			{ x: offset.x,                    	y: offset.y + this.r },
		];
	}
}