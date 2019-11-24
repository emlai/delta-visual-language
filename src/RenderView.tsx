import * as React from "react";
import {useEffect} from "react";
import * as PIXI from "pixi.js";

export function RenderView() {
  useEffect(() => {
    const app = new PIXI.Application({antialias: true});
    document.getElementsByClassName("RenderView")[0].appendChild(app.view);

    const graphics = new PIXI.Graphics();

    graphics.beginFill(0xde3249);
    graphics.drawRect(50, 50, 100, 100);
    graphics.endFill();

    app.stage.addChild(graphics);
  }, []);

  return <div className="RenderView" />;
}
