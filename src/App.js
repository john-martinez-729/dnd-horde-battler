import './App.css';
import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container,
  Col,
  Row,
  FormControl,
  Button
} from 'react-bootstrap'
import {
  GiCheckedShield,
  GiSwordBrandish,
  GiHearts,
  GiDiceEightFacesEight,
  GiDeathSkull,
} from 'react-icons/gi'
import {
  AiOutlineUndo,
  AiOutlineDelete,
  AiOutlineQuestionCircle,
  AiOutlinePlus
} from 'react-icons/ai'


const MAX_DAM_DICE = 12
const DICE_OPTIONS = [4, 6, 8, 10, 12, 20]
const STARTING_HP = 1
const STARTING_AC = 10

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hordeA: {
        arr: [],
        hp: STARTING_HP,
        ac: STARTING_AC,
        att: 0,
        damDice: '',
        validity: true,
      },
      hordeB: {
        arr: [],
        hp: STARTING_HP,
        ac: STARTING_AC,
        att: 0,
        damDice: '',
        validity: true,
      },
      combatLog: []
    }
  }

  changeStats = (e, horde) => {
    this.setState({
      [horde]: {
        ...this.state[horde],
        [e.target.name]: e.target.value
      }
    })
  }

  parseDamDice = (dice, critical) => {
    let numOfDice, dieSize, modifier
    let total = 0
    const damDice = dice.toUpperCase()

    if (damDice.includes('D')) {
      const split = damDice.split('D')
      const splitA = split[0]
      const splitB = split[1]

      if (splitB.includes('+')) {
        const splitAgain = splitB.split('+')
        dieSize = parseInt(splitAgain[0])
        modifier = parseInt(splitAgain[1])
      } else if (splitB.includes('-')) {
        const splitAgain = splitB.split('-')
        dieSize = parseInt(splitAgain[0])
        modifier = parseInt(splitAgain[1])
      } else {
        dieSize = parseInt(split[1])
        modifier = 0
      }

      numOfDice = parseInt(splitA)

      if (critical) {
        numOfDice *= 2
      }

      const maxDieRoll = dieSize + modifier
      const minDieRoll = 1 + modifier

      for (var i = 0; i < numOfDice; i++) { //Loop a number of times equal to the number of dice
        total += this.rollDie(minDieRoll, maxDieRoll)
      }

      return total
    } else {
      this.setState({
        validity: false
      })
    }
  }

  rollDie = (min, max) => {
    return min + Math.floor(Math.random() * (max-min + 1))
  }

  handleAddToHorde = horde => {
    const correctHorde = this.state[horde]
    this.setState({
      [horde]: {
        ...this.state[horde],
        arr: [
          ...this.state[horde].arr,
          {
            num: correctHorde.arr.length + 1,
            hp: correctHorde.hp || 1,
            ac: correctHorde.ac || 10,
            att: correctHorde.att || 0,
            damDice: correctHorde.damDice || '1d1'
          }
        ]
      }
    })
  }

  deleteCreature = (horde, i) => {
    const correctHordeArr = this.state[horde].arr
    const deletedCreature = correctHordeArr.splice(i, 1)

    this.setState({
      [horde]: {
        ...this.state[horde],
        arr: correctHordeArr
      }
    })
  }

  attack = (attHorde, defender) => {
    const attackingHorde = this.state[attHorde].arr
    const combatLog = this.state.combatLog
    let defendingHorde = this.state[defender].arr

    for (let i = 0; i < attackingHorde.length; i++) {
      const attacker = attackingHorde[i]
      if (attacker.hp > 0) {
        let indexBeingAttacked = Math.floor((Math.random() * defendingHorde.length))
        if (defendingHorde[indexBeingAttacked].hp <= 0) {
          indexBeingAttacked = Math.floor((Math.random() * defendingHorde.length))
        }

        const defender = defendingHorde[indexBeingAttacked]
        const attackRoll = this.rollDie(1 + attacker.att, 20 + attacker.att)
        if (attackRoll - attacker.att == 20) {
          const total = this.parseDamDice(attackingHorde[i].damDice, 'critical')
          combatLog.push(`#${attacker.num} from ${attHorde} attacks #${defender.num} scoring a critical hit (${attackRoll}), dealing ${total} damage!!`)
        } else if (attackRoll >= defender.ac) {
          const total = this.parseDamDice(attackingHorde[i].damDice)
          defendingHorde[indexBeingAttacked].hp -= total
          combatLog.push(`#${attacker.num} from ${attHorde} attacks #${defender.num} and hits (${attackRoll}), dealing ${total} damage!`)

          this.setState({
            [defender]: {
              ...this.state[defender],
              arr: defendingHorde
            },
            combatLog: combatLog
          })
        } else {
          combatLog.push(`#${attacker.num} from ${attHorde} attacks #${defender.num} and misses (${attackRoll}).`)
          this.setState({
            combatLog: combatLog
          })
        }
      }
    }
  }

  resetHorde = horde => {
    this.setState({
      [horde]: {
        ...this.state[horde],
        arr: []
      }
    })
  }

  renderCreature = (creature, horde, i) => {
    const maxHP = this.state[horde].hp
    let currentHP = creature.hp > 0 ? creature.hp : 0

    let id
    if (currentHP == 0) {
      id = 'dead'
    } else if (currentHP < maxHP && currentHP > maxHP / 2) {
      id = 'damaged'
    } else if (currentHP <= maxHP / 2) {
      id = 'bloodied'
    } else {
      id = 'normal'
    }

    return (
      <div key={`creatureContainer; ${horde}: ${i}`} className='creature-container' id={id}>
        <AiOutlineDelete className='delete-icon' onClick={() => this.deleteCreature(horde, i)} />
        <div className='creature-designation'>#{creature.num}</div>
        <GiDeathSkull className='skull'/>
        <div className='data'>
          {currentHP} / {maxHP}
        </div>
      </div>
    )
  }

  renderCombatLogEntry = (entry, i) => {
    return (
      <div key={`combatLogEntry: ${i}`} className='entry'>
        {`Entry #${i + 1}.`}
        <div className='text'>{entry}</div>
      </div>
    )
  }

  render() {
    return (
      <Container className='App' fluid>
        <Row noGutters className='top-row'>
          <Col className='top-col divider'>
            <div className='title-content'>
              <div className='title'>
                D&D Horde Battler
              </div>
              <div className='subtext'>
                This program utilizes basic d20 rules to
                determine the outcome of a pitched battle between two groups of
                combatants.
              </div>
            </div>

            <div className='horde-data-div'>
              <Button
                onClick={() => this.handleAddToHorde('hordeA')}
                className='common-button add-button'>
                <AiOutlinePlus />
                Add to Horde
              </Button>

              <div className='header'>Horde A</div>

              <Row noGutters>
                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiHearts className='label-icon'/>
                    HP
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeA')}
                    name='hp'
                    value={this.state.hordeA.hp}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiCheckedShield className='label-icon'/>
                    AC
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeA')}
                    name='ac'
                    value={this.state.hordeA.ac}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiSwordBrandish className='label-icon'/>
                    Attack Bonus
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeA')}
                    name='att'
                    value={this.state.hordeA.att}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiDiceEightFacesEight className='label-icon'/>
                    Damage
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeA')}
                    name='damDice'
                    placeholder='Ex. 1d8+2; 3d6+4'
                    value={this.state.hordeA.damDice} />
                </Col>

              </Row>
            </div>

            <div className='horde-data-div'>
              <Button
                onClick={() => this.handleAddToHorde('hordeB')}
                className='common-button add-button'>
                <AiOutlinePlus />
                Add to Horde
              </Button>

              <div className='header'>Horde B</div>

              <Row noGutters>
                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiHearts className='label-icon'/>
                    HP
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeB')}
                    name='hp'
                    value={this.state.hordeB.hp}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiCheckedShield className='label-icon'/>
                    AC
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeB')}
                    name='ac'
                    value={this.state.hordeB.ac}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiSwordBrandish className='label-icon'/>
                    Attack Bonus
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeB')}
                    name='att'
                    value={this.state.hordeB.att}
                    type='number' />
                </Col>

                <Col lg={4} className='form-control-container'>
                  <label>
                    <GiDiceEightFacesEight className='label-icon'/>
                    Damage
                  </label>
                  <FormControl
                    onChange={e => this.changeStats(e, 'hordeB')}
                    name='damDice'
                    placeholder='Ex. 1d8+2; 3d6+4'
                    value={this.state.hordeB.damDice} />
                </Col>
              </Row>
            </div>
          </Col>
          <Col className='top-col'>
            <div className='horde-data-div horde-container'>

              <Button
                disabled={this.state.hordeA.arr.length == 0 && true || this.state.hordeB.arr.length == 0 && true}
                onClick={() => this.attack('hordeA', 'hordeB')}
                className='common-button attack-button'>
                <GiSwordBrandish />
                Attack!
              </Button>

              <AiOutlineUndo onClick={() => this.resetHorde('hordeA')} className='reset-icon'/>

              <div className='header'>
                Horde A
                ({this.state.hordeA.arr.length})
              </div>
              <Row noGutters>
                {
                  this.state.hordeA.arr.map((creature, i) => this.renderCreature(creature, 'hordeA', i))
                }
              </Row>
            </div>

            <div className='horde-data-div horde-container'>
              <Button
                disabled={this.state.hordeA.arr.length == 0 && true || this.state.hordeB.arr.length == 0 && true}
                onClick={() => this.attack('hordeB', 'hordeA')}
                className='common-button attack-button'>
                <GiSwordBrandish />
                Attack!
              </Button>

              <AiOutlineUndo onClick={() => this.resetHorde('hordeB')} className='reset-icon'/>

              <div className='header'>
                Horde B
                ({this.state.hordeB.arr.length})
              </div>
              <Row noGutters>
                {
                  this.state.hordeB.arr.map((creature, i) => this.renderCreature(creature, 'hordeB', i))
                }
              </Row>
            </div>

            <div className='horde-data-div combat-log-container'>
              <div className='header'>
                Combat Log
              </div>

              <div className='combat-log'>
                {
                  this.state.combatLog.map((entry, i) => this.renderCombatLogEntry(entry, i))
                }
              </div>
            </div>
          </Col>
        </Row>

        <Row noGutters className='footer-row'>
          Written by John Martinez
        </Row>
      </Container>
    )
  }

}

export default App;
