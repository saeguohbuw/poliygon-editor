export class Renderer {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
  }

  draw(polygons, selectedId) {
    this.clear();

    polygons.forEach((p) => {
      this.ctx.beginPath();

      p.points.forEach((pt, i) => {
        if (i === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      });

      this.ctx.closePath();

      this.ctx.fillStyle = p.color;
      this.ctx.fill();

      this.ctx.strokeStyle = p.id === selectedId ? "yellow" : "#111";
      this.ctx.lineWidth = p.id === selectedId ? 3 : 1;
      this.ctx.stroke();
    });
  }

  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
