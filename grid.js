class Grid {
    constructor(hexagon, sizeAcross = 1, sizeDown = 1, offsetLeft = 0.0, offsetTop = 0.0, includeTrailingEvenColumnHex = true) {
        if (hexagon === undefined) {
            hexagon = new Hex({ sideLength: 1 });
        }

        this.hex = hexagon;

        this.across = sizeAcross;
        this.down = sizeDown;
        this.offsetLeft = offsetLeft;
        this.offsetTop = offsetTop;
        this.includeTrailingEvenColumnHex = includeTrailingEvenColumnHex;

        this.height = this.hex.height * this.down + (this.across > 1 && this.includeTrailingEvenColumnHex ? this.hex.sectionHeight : 0.0);
        this.width = this.hex.sectionWidth * (this.across - 1) + this.hex.width;
    }

    offsetForGridPosition(xIndex = 0, yIndex = 0) {
        var x = this.offsetLeft + this.hex.sectionWidth * xIndex;
        var y = this.offsetTop + this.hex.height * yIndex;
    
        if (xIndex % 2 === 1) {
            // Every 2nd row is shifted down so add half height
            y += this.hex.sectionHeight;
        }
        
        return {
            x: x,
            y: y
        };
    }

    shouldRenderHexForGridPosition(xIndex, yIndex) {
        if (this.includeTrailingEvenColumnHex) {
            return true;
        }

        return xIndex % 2 === 0 || yIndex !== this.down - 1;
    }
    
    get size() {
        return { width: this.offsetLeft + this.width, height: this.offsetTop + this.height };
    }
}