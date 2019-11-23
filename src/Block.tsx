import * as React from "react";
import {BlockData, Decl, Expr, If, isFunc, VarDecl} from "./interpreter";
import {Lens} from "./lens";
import {Expression, ExprSlot} from "./Expression";
import {Menu} from "./Menu";
import {useContextMenu} from "./context-menu";
import {ExprEditField} from "./ExprEditField";
import {nextId} from "./utils";
import {IoMdAdd} from "react-icons/io";

type Props = {
  data: Lens<BlockData>;
  deleteBlock: () => void;
  decls: Decl[];
};

export function Block(props: Props) {
  const block = props.data.current;

  const ContextMenuTrigger = useContextMenu(
    <Menu items={[{value: "deleteBlock", label: <span>Delete block</span>}]} select={props.deleteBlock} />
  );

  switch (block.type) {
    case "empty":
      const select = (name: string) => {
        switch (name) {
          case "if":
            props.data.set({type: "if", condition: {type: "empty"}, then: [], else: []});
            break;

          default:
            const decl = props.decls.find(decl => decl.name === name);

            if (decl && isFunc(decl)) {
              props.data.set({type: "call", funcId: decl.id, args: decl.params.map(() => ({type: "empty"}))});
            } else {
              props.data.set({type: "var-decl", id: nextId(), name: name, value: {type: "empty"}});
            }
            break;
        }
      };

      return (
        <ContextMenuTrigger className="Block">
          <ExprEditField expr={props.data as Lens<Expr>} decls={props.decls} select={select} />
        </ContextMenuTrigger>
      );

    case "call":
      return (
        <ContextMenuTrigger className="Block">
          <Expression expr={props.data as Lens<Expr>} decls={props.decls} />
        </ContextMenuTrigger>
      );

    case "var-decl":
      return (
        <ContextMenuTrigger className="Block VarDecl">
          <div>{block.name}</div>
          <span>{"←"}</span>
          <ExprSlot expr={(props.data as Lens<VarDecl>).value} decls={props.decls} />
        </ContextMenuTrigger>
      );

    case "if":
      const ifExpr = props.data as Lens<If>;
      const x0 = 100;
      const x1 = 15;
      const x2 = 235;

      const Lines = ({y0, y1}: {y0: number; y1: number}) => {
        return (
          <svg width={420} height={30}>
            <path d={`M${x0},${y0} C${x0},${y1} ${x1},${y0} ${x1},${y1}`} />
            <path d={`M${x0},${y0} C${x0},${y1} ${x2},${y0} ${x2},${y1}`} />
          </svg>
        );
      };

      return (
        <>
          <ContextMenuTrigger className="Block If">
            <div>{"if"}</div>
            <div className="Condition">
              <ExprSlot expr={ifExpr.condition} decls={props.decls} />
            </div>
          </ContextMenuTrigger>

          <div className="IfBody">
            <div className="Lines">
              <Lines y0={0} y1={30} />
              <div className="Labels">
                <span style={{transform: `translateX(${x1 + (x0 - x1) / 2 - 15}px)`}}>then</span>
                <span style={{transform: `translateX(${x0 + (x2 - x0) / 2 - 15}px)`}}>else</span>
              </div>
            </div>
            <div className="ThenElse">
              <div className="Then">
                <Blocks blocks={ifExpr.then} decls={props.decls} />
              </div>
              <div className="Else">
                <Blocks blocks={ifExpr.else} decls={props.decls} />
              </div>
            </div>
            <div className="Lines">
              <Lines y0={30} y1={0} />
            </div>
          </div>
        </>
      );
  }
}

export function Blocks(props: {blocks: Lens<BlockData[]>; decls: Decl[]}) {
  const addBlock = () => props.blocks.push({type: "empty"});

  return (
    <div className="Blocks">
      {props.blocks.map((block, index, blocks) => (
        <Block data={block} decls={props.decls} deleteBlock={() => blocks.remove(index)} key={index} />
      ))}
      <a href="#" className="AddBlockButton" onClick={addBlock}>
        <IoMdAdd />
      </a>
    </div>
  );
}
