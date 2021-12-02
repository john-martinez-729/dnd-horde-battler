import "./App.css";
import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Col, Row, FormControl, Button } from "react-bootstrap";
import {
  GiCheckedShield,
  GiSwordBrandish,
  GiHearts,
  GiDiceEightFacesEight,
  GiDeathSkull,
} from "react-icons/gi";
import {
  AiOutlineUndo,
  AiOutlineDelete,
  AiOutlineQuestionCircle,
  AiOutlinePlus,
} from "react-icons/ai";

const MAX_DAM_DICE = 12;
const DICE_OPTIONS = [4, 6, 8, 10, 12, 20];
const STARTING_HP = 1;
const STARTING_AC = 10;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      creatureStats: {
        hp: STARTING_HP,
        ac: STARTING_AC,
        att: 0,
        damDice: "",
        validity: true,
      },
      hordeA: [],
      hordeB: [],
      combatLog: [],
      numOfCreatures: 1,
      chosenHorde: "",
    };
  }

  changeStats = (e) => {
    this.setState({
      creatureStats: {
        ...this.state.creatureStats,
        [e.target.name]: e.target.value,
      },
    });
  };

  changeParams = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  parseDamDice = (dice, critical) => {
    let numOfDice, dieSize, modifier;
    let total = 0;
    const damDice = dice.toUpperCase();

    if (damDice.includes("D")) {
      const split = damDice.split("D");
      const splitA = split[0];
      const splitB = split[1];

      if (splitB.includes("+")) {
        const splitAgain = splitB.split("+");
        dieSize = parseInt(splitAgain[0]);
        modifier = parseInt(splitAgain[1]);
      } else if (splitB.includes("-")) {
        const splitAgain = splitB.split("-");
        dieSize = parseInt(splitAgain[0]);
        modifier = parseInt(splitAgain[1]);
      } else {
        dieSize = parseInt(split[1]);
        modifier = 0;
      }

      numOfDice = parseInt(splitA);

      if (critical) {
        numOfDice *= 2;
      }

      const maxDieRoll = dieSize + modifier;
      const minDieRoll = 1 + modifier;

      for (var i = 0; i < numOfDice; i++) {
        //Loop a number of times equal to the number of dice
        total += this.rollDie(minDieRoll, maxDieRoll);
      }

      return total;
    } else {
      this.setState({
        validity: false,
      });
    }
  };

  rollDie = (min, max) => {
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  handleAddToHorde = () => {
    const { creatureStats, numOfCreatures, chosenHorde } = this.state;
    const newHorde = this.state[chosenHorde];

    for (let i = 0; i < numOfCreatures; i++) {
      const newCreature = {
        num: newHorde.length + 1,
        hp: parseInt(creatureStats.hp) || 1,
        maxHp: parseInt(creatureStats.hp) || 1,
        ac: parseInt(creatureStats.ac) || 10,
        att: parseInt(creatureStats.att) || 0,
        damDice: creatureStats.damDice || "1d1",
      };
      newHorde.push(newCreature);
    }

    this.setState({
      [this.state.chosenHorde]: newHorde,
    });
  };

  deleteCreature = (horde, i) => {
    const correctHordeArr = this.state[horde];
    const deletedCreature = correctHordeArr.splice(i, 1);

    this.setState({
      [horde]: correctHordeArr,
    });
  };

  attack = (attHorde, defender) => {
    const attackingHorde = this.state[attHorde];
    const combatLog = this.state.combatLog;
    let defendingHorde = this.state[defender];

    for (let i = 0; i < attackingHorde.length; i++) {
      const attacker = attackingHorde[i];
      if (attacker.hp > 0) {
        let indexBeingAttacked = Math.floor(
          Math.random() * defendingHorde.length
        );
        if (defendingHorde[indexBeingAttacked].hp <= 0) {
          indexBeingAttacked = Math.floor(
            Math.random() * defendingHorde.length
          );
        }

        const defender = defendingHorde[indexBeingAttacked];

        const attackRoll = this.rollDie(1 + attacker.att, 20 + attacker.att);

        if (attackRoll - attacker.att == 20) {
          const total = this.parseDamDice(
            attackingHorde[i].damDice,
            "critical"
          );
          combatLog.push(
            `#${attacker.num} from ${attHorde} attacks #${defender.num} scoring a critical hit (${attackRoll}), dealing ${total} damage!!`
          );
        } else if (attackRoll >= defender.ac) {
          const total = this.parseDamDice(attackingHorde[i].damDice);
          defendingHorde[indexBeingAttacked].hp -= total;
          combatLog.push(
            `#${attacker.num} from ${attHorde} attacks #${defender.num} and hits (${attackRoll}), dealing ${total} damage!`
          );

          this.setState({
            [defender]: {
              ...this.state[defender],
              arr: defendingHorde,
            },
            combatLog: combatLog,
          });
        } else {
          combatLog.push(
            `#${attacker.num} from ${attHorde} attacks #${defender.num} and misses (${attackRoll}).`
          );
          this.setState({
            combatLog: combatLog,
          });
        }
      }
    }
  };

  resetHorde = (horde) => {
    this.setState({
      [horde]: [],
    });
  };

  renderCreature = (creature, horde, i) => {
    const { maxHp, hp, num } = creature;
    let currentHp = hp > 0 ? hp : 0;

    let id;
    if (currentHp == 0) {
      id = "dead";
    } else if (currentHp < maxHp && currentHp > maxHp / 2) {
      id = "damaged";
    } else if (currentHp <= maxHp / 2) {
      id = "bloodied";
    } else {
      id = "normal";
    }

    return (
      <div
        key={`creatureContainer; ${horde}: ${i}`}
        className="creature-container"
        id={id}
      >
        <AiOutlineDelete
          className="delete-icon"
          onClick={() => this.deleteCreature(horde, i)}
        />
        <div className="creature-designation">#{num}</div>
        <GiDeathSkull className="skull" />
        <div className="data">
          {currentHp} / {maxHp}
        </div>
      </div>
    );
  };

  renderCombatLogEntry = (entry, i) => {
    return (
      <div key={`combatLogEntry: ${i}`} className="entry">
        {`Entry #${i + 1}.`}
        <div className="text">{entry}</div>
      </div>
    );
  };

  disabledAttackBtn = () => {
    let disabled = false;
    let countA = 0;
    let countB = 0;
    for (let i = 0; i < this.state.hordeA.length; i++) {
      if (this.state.hordeA[i].hp == 0) {
        countA++;
      }
    }

    for (let i = 0; i < this.state.hordeB.length; i++) {
      if (this.state.hordeB[i].hp == 0) {
        countB++;
      }
    }

    if (
      countA == this.state.hordeA.length ||
      countB == this.state.hordeB.length ||
      this.state.hordeA.length == 0 ||
      this.state.hordeB.length == 0
    ) {
      disabled = true;
    }

    return disabled;
  };

  //////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  header = () => (
    <div className="title-content">
      <div className="title">D&D Horde Battler</div>
      <div className="subtext">
        This program utilizes basic d20 rules to determine the outcome of a
        pitched battle between two groups of combatants.
      </div>
    </div>
  );

  creatureStats = () => {
    const { hp, ac, att, damDice } = this.state.creatureStats;
    return (
      <div className="horde-data-div">
        <div className="creature-input-container">
          <FormControl
            onChange={this.changeParams}
            name="numOfCreatures"
            value={this.state.numOfCreatures}
            placeholder="# of creatures..."
            type="number"
            className="number-of-creatures-form-control"
          />

          <FormControl
            onChange={this.changeParams}
            name="chosenHorde"
            value={this.state.chosenHorde}
            as="select"
            className="select-horde-form-control"
          >
            <option value="">Select a horde...</option>
            <option value="hordeA">Horde A</option>
            <option value="hordeB">Horde B</option>
          </FormControl>

          <Button
            onClick={() => this.handleAddToHorde("hordeA")}
            className="common-button add-button"
          >
            <AiOutlinePlus />
            Add to Horde
          </Button>
        </div>

        <div className="header">Creature Stats</div>

        <Row noGutters>
          <Col lg={4} className="form-control-container">
            <label>
              <GiHearts className="label-icon" />
              HP
            </label>
            <FormControl
              onChange={this.changeStats}
              name="hp"
              value={hp}
              type="number"
            />
          </Col>

          <Col lg={4} className="form-control-container">
            <label>
              <GiCheckedShield className="label-icon" />
              AC
            </label>
            <FormControl
              onChange={this.changeStats}
              name="ac"
              value={ac}
              type="number"
            />
          </Col>

          <Col lg={4} className="form-control-container">
            <label>
              <GiSwordBrandish className="label-icon" />
              Attack Bonus
            </label>
            <FormControl
              onChange={this.changeStats}
              name="att"
              value={att}
              type="number"
            />
          </Col>

          <Col lg={4} className="form-control-container">
            <label>
              <GiDiceEightFacesEight className="label-icon" />
              Damage
            </label>
            <FormControl
              onChange={this.changeStats}
              name="damDice"
              placeholder="Ex. 1d8+2; 3d6+4"
              value={damDice}
            />
          </Col>
        </Row>
      </div>
    );
  };

  hordeA = () => {
    const disabled = this.disabledAttackBtn();
    const horde = this.state.hordeA;
    const remaining = horde.reduce((acc, cur) => (cur.hp > 0 ? ++acc : acc), 0);
    return (
      <div className="horde-data-div horde-container">
        <Button
          disabled={disabled}
          onClick={() => this.attack("hordeA", "hordeB")}
          className="common-button attack-button"
        >
          <GiSwordBrandish />
          Attack!
        </Button>

        <AiOutlineUndo
          onClick={() => this.resetHorde("hordeA")}
          className="reset-icon"
        />

        <div className="header">{`Horde A (${remaining}/${horde.length})`}</div>
        <Row noGutters>
          {horde.map((creature, i) =>
            this.renderCreature(creature, "hordeA", i)
          )}
        </Row>
      </div>
    );
  };

  hordeB = () => {
    const disabled = this.disabledAttackBtn();
    const horde = this.state.hordeB;
    const remaining = horde.reduce((acc, cur) => (cur.hp > 0 ? ++acc : acc), 0);
    return (
      <div className="horde-data-div horde-container">
        <Button
          disabled={disabled}
          onClick={() => this.attack("hordeB", "hordeA")}
          className="common-button attack-button"
        >
          <GiSwordBrandish />
          Attack!
        </Button>

        <AiOutlineUndo
          onClick={() => this.resetHorde("hordeB")}
          className="reset-icon"
        />

        <div className="header">{`Horde B (${remaining}/${horde.length})`}</div>
        <Row noGutters>
          {horde.map((creature, i) =>
            this.renderCreature(creature, "hordeB", i)
          )}
        </Row>
      </div>
    );
  };

  footer = () => (
    <div className="footer">
      Created by{" "}
      <a target="_blank" href="https://www.instagram.com/buttcheeksio/?hl=en">
        John Martinez
      </a>
    </div>
  );

  combatLog = () => (
    <div className="horde-data-div combat-log-container">
      <div className="header">Combat Log</div>
      <div className="combat-log">
        {this.state.combatLog.map((entry, i) =>
          this.renderCombatLogEntry(entry, i)
        )}
      </div>
    </div>
  );

  render() {
    return (
      <div className="App">
        <Row noGutters className="top-row">
          <Col lg={6} className="top-col divider">
            {this.header()}
            {this.creatureStats()}
          </Col>
          <Col lg={6} className="top-col">
            {this.hordeA()}
            {this.hordeB()}
            {this.combatLog()}
          </Col>
        </Row>
        {this.footer()}
      </div>
    );
  }
}

// {this.header()}
// {this.creatureStats()}
//
// {this.hordeA()}
// {this.hordeB()}
// {this.combatLog()}

export default App;
