<template>
    <div id="app">

        <nav class="navbar navbar-default">
            <div class="container-fluid">
                <div class="navbar-header">
                    <span class="navbar-brand">Tichu Counter</span>
                </div>
                <div v-if="enableSave" class="top-setting hidden-xs">
                    <label><input type="checkbox" v-model="autoSave"> AUTOSAVE</label>
                </div>
                <div v-if="enableSave" class="top-controls">
                    <a v-if="pastGames.length" @click.prevent="showPastGames = !showPastGames" href="#" class="btn btn-default">
                        <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>
                        Load <span class="hidden-xs">game</span>
                    </a>
                    <a @click.prevent="saveGame(false)" href="#" class="btn btn-default">
                        <span class="glyphicon glyphicon-floppy-disk" aria-hidden="true"></span>
                        Save <span class="hidden-xs">game</span>
                    </a>
                    <a @click.prevent="saveGame(true)" href="#" class="btn btn-primary">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        New <span class="hidden-xs">game</span>
                    </a>
                </div>
                <div v-else class="top-controls">
                    <a @click.prevent="initGame" href="#" class="btn btn-primary">
                        <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        New <span class="hidden-xs">game</span>
                    </a>
                </div>
            </div>
        </nav>

        <div v-if="showPastGames && pastGames.length" class="past-games container-fluid">
            <div class="row">
                <div class="col-sm-4">
                    <p class="past-games-controls">
                        <a @click.prevent="showPastGames = false" href="#" class="btn btn-default">
                            <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            Back to game
                        </a>
                        <a @click.prevent="deleteAllGames" href="#" class="btn btn-danger">
                            <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                            Delete all games
                        </a>
                    </p>
                    <h3>Select a game to load:</h3>
                </div>
                <div class="col-sm-8">
                    <div class="past-game-tiles">
                        <div v-for="(game, index) in pastGames" class="past-game-tile">
                            <div>
                                <p class="date">{{ game.started }}</p>
                                <h4>{{ game.names.a }} <span>vs</span> {{ game.names.b }}</h4>
                                <h5>{{ game.total.a }} - {{ game.total.b }}</h5>
                                <div class="buttons">
                                    <a @click.prevent="loadGame(index)" href="#" class="btn btn-default btn-sm">Load game</a>
                                    <a @click.prevent="deleteGame(index)" href="#" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <div class="container">
            <div class="row players-row">
                <div class="players-vs">vs</div>
                <div class="col-xs-6">
                    <div class="player-name">
                        <div v-if="showEditName != 'a'" @click="editName('a')">
                            <span>{{ game.names.a ? game.names.a : 'Team A' }}</span>
                            <p>click to edit name</p>
                        </div>
                        <input v-else type="text" class="form-control" maxlength="20" placeholder="Team A" tabindex="1"
                            ref="nameA"
                            v-model="game.names.a"
                            @keyup.enter="showEditName = false"
                            @blur="showEditName = false"
                        >
                    </div>
                    <div class="player-total">
                        <strong>{{ totalScore.a }}</strong>
                    </div>
                    <div class="player-tile">
                        <div class="player-score">
                            <a @click.prevent="modify('a', 'remove')" href="#">&minus;</a>
                            <strong>{{ roundScore.a }}</strong>
                            <a @click.prevent="modify('a', 'add')" href="#">+</a>
                        </div>

                        <div class="player-extras">
                            <select v-model="game.roundExtras.a" @change="validateExtras('a')" class="form-control">
                                <option value="-200"> Grand Tichu lost</option>
                                <option value="-100"> Tichu lost</option>
                                <option value="0"> No Tichu</option>
                                <option value="100"> Tichu won</option>
                                <option value="200"> Grand Tichu won</option>
                            </select>
                            <label><input type="checkbox" v-model="game.roundExtras.aDouble" @change="validateExtras('a')"> Double win</label>
                        </div>
                    </div>
                </div>
                <div class="col-xs-6">
                    <div class="player-name">
                        <div v-if="showEditName != 'b'" @click="editName('b')">
                            <span>{{ game.names.b ? game.names.b : 'Team B' }}</span>
                            <p>click to edit name</p>
                        </div>
                        <input v-else type="text" class="form-control" maxlength="20" placeholder="Team B" tabindex="2"
                            ref="nameB"
                            v-model="game.names.b"
                            @keyup.enter="showEditName = false"
                            @blur="showEditName = false"
                        >
                    </div>
                    <div class="player-total">
                        <strong>{{ totalScore.b }}</strong>
                    </div>
                    <div class="player-tile">
                        <div class="player-score">
                            <a @click.prevent="modify('b', 'remove')" href="#">&minus;</a>
                            <strong>{{ roundScore.b }}</strong>
                            <a @click.prevent="modify('b', 'add')" href="#">+</a>
                        </div>

                        <div class="player-extras">
                            <select v-model="game.roundExtras.b" @change="validateExtras('b')" class="form-control">
                                <option value="-200"> Grand Tichu lost</option>
                                <option value="-100"> Tichu lost</option>
                                <option value="0"> No Tichu</option>
                                <option value="100"> Tichu won</option>
                                <option value="200"> Grand Tichu won</option>
                            </select>
                            <label><input type="checkbox" v-model="game.roundExtras.bDouble" @change="validateExtras('b')"> Double win</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="next-round">
                <a @click.prevent="nextRound" href="#" class="btn btn-primary btn-lg">Next round</a>
            </div>

            <table class="game-log table table-striped table-hover" v-if="game.pastRounds.length">
                <thead>
                    <tr>
                        <th class="text-center">#</th>
                        <th class="text-right">{{ game.names.a ? game.names.a : 'Team A' }}</th>
                        <th class="text-left">{{ game.names.b ? game.names.b : 'Team B' }}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(past, index) in filteredPastRounds">
                        <td class="text-center">{{ game.pastRounds.length - index }}</td>
                        <td class="text-right"><span>{{ past.a >= 0 ? '+' + past.a : past.a }}</span> {{ past.totalA }}</td>
                        <td class="text-left">{{ past.totalB }} <span>{{ past.b >= 0 ? '+' + past.b : past.b }}</span></td>
                        <td class="text-center"><a @click.prevent="deleteRound(index)" href="#"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>
</template>

<script>
import { storage } from './helpers/localstorage'

export default {
    name: 'app',
    data() {
        return {
            enableSave: false,
            autoSave: true,
            showEditName: false,
            showPastGames: false,
            game: {},
            pastGames: []
        }
    },
    computed: {
        roundScore() {
            let score = {
                a: Number(this.game.roundExtras.a),
                b: Number(this.game.roundExtras.b)
            };
            score.a += (this.game.roundExtras.aDouble ? 200 : (this.game.roundExtras.bDouble ? 0 : this.game.round.a));
            score.b += (this.game.roundExtras.bDouble ? 200 : (this.game.roundExtras.aDouble ? 0 : this.game.round.b));
            return score;
        },
        totalScore() {
            return {
                a: this.game.pastRounds.reduce((value, round) => {
                  return value + round.a;
                }, 0),
                b: this.game.pastRounds.reduce((value, round) => {
                  return value + round.b;
                }, 0)
            }
        },
        filteredPastRounds() {
            let totalA = 0;
            let totalB = 0;
            return this.game.pastRounds.reverse().map((round) => {
                totalA += round.a;
                round.totalA = totalA;
                totalB += round.b;
                round.totalB = totalB;
                return round;
            }).reverse();
        }
    },
    created() {
        this.enableSave = storage.enabled();
        this.initGame();
        this.resetRound();
        this.loadPastGames();
    },
    methods: {
        initGame() {
            let d = new Date();
            let date = ('0' + d.getDate()).slice(-2) + '-' + ('0'+(d.getMonth()+1)).slice(-2) + '-' +
                d.getFullYear() + ' ' + ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);

            this.game = {
                id: this.guid(),
                started: date,
                names: {
                    a: (typeof this.game.names !== 'undefined' ? this.game.names.a : 'Team A'),
                    b: (typeof this.game.names !== 'undefined' ? this.game.names.b : 'Team B')
                },
                roundExtras: {
                    a: 0,
                    b: 0
                },
                round: {
                    a: 50,
                    b: 50
                },
                pastRounds: []
            };
            this.showPastGames = false;
        },
        editName(player) {
            this.showEditName = player;
            if (player == 'a')
                window.setTimeout(() => { this.$refs.nameA.select(); }, 200);
            else
                window.setTimeout(() => { this.$refs.nameB.select(); }, 200);
        },
        validateExtras(player) {
            if (this.game.roundExtras.a !== 0 && this.game.roundExtras.b !== 0) {
                if (player == 'a')
                    this.game.roundExtras.b = 0;
                else
                    this.game.roundExtras.a = 0;
            }
            if (this.game.roundExtras.aDouble && this.game.roundExtras.bDouble) {
                if (player == 'a')
                    this.game.roundExtras.bDouble = false;
                else
                    this.game.roundExtras.aDouble = false;
            }
            if (this.game.roundExtras.aDouble) {
                if (this.game.roundExtras.a < 0) this.game.roundExtras.a = 0;
                if (this.game.roundExtras.b > 0) this.game.roundExtras.b = 0;
            }
            if (this.game.roundExtras.bDouble) {
                if (this.game.roundExtras.b < 0) this.game.roundExtras.b = 0;
                if (this.game.roundExtras.a > 0) this.game.roundExtras.a = 0;
            }
        },
        modify(player, mode) {
            if (player == 'a') {
                this.game.round.a = mode == 'add' ? this.game.round.a + 5 : this.game.round.a - 5;
                this.game.round.b = mode == 'add' ? this.game.round.b - 5 : this.game.round.b + 5;
            }
            else {
                this.game.round.b = mode == 'add' ? this.game.round.b + 5 : this.game.round.b - 5;
                this.game.round.a = mode == 'add' ? this.game.round.a - 5 : this.game.round.a + 5;
            }
            if (this.game.round.a < -25) this.game.round.a = -25;
            if (this.game.round.b < -25) this.game.round.b = -25;
            if (this.game.round.a > 125) this.game.round.a = 125;
            if (this.game.round.b > 125) this.game.round.b = 125;
        },
        resetRound() {
            this.game.round = {
                a: 50,
                b: 50
            };
            this.game.roundExtras = {
                a: 0,
                b: 0,
                aDouble: false,
                bDouble: false
            };
        },
        nextRound() {
            this.game.pastRounds.unshift(Object.assign({}, this.roundScore));
            if (this.autoSave) {
                this.showPastGames = false;
                this.saveGame();
            }
            this.resetRound();
        },
        deleteRound(index) {
            this.game.pastRounds.splice(index, 1);
        },
        loadPastGames(games = false) {
            if (games !== false) {
                this.pastGames = games;
                return;
            }
            let storedGames = storage.get('tichugames');
            return this.pastGames = storedGames !== false ? JSON.parse(storedGames) : [];
        },
        saveGame(startNewGame = false) {
            this.loadPastGames();

            let index = this.pastGames.map( (el) => el.id ).indexOf(this.game.id);
            if (index !== -1) { // edit
                this.pastGames[index] = Object.assign(this.game, { total: this.totalScore });
            }
            else { // add
                this.pastGames.unshift(Object.assign(this.game, { total: this.totalScore }));
            }
            storage.set('tichugames', JSON.stringify(this.pastGames));
            this.loadPastGames(this.pastGames);
            if (startNewGame) {
                this.initGame();
            }
        },
        deleteGame(index) {
            this.pastGames.splice(index, 1);
            storage.set('tichugames', JSON.stringify(this.pastGames));
            this.loadPastGames(this.pastGames);
        },
        deleteAllGames() {
            if (confirm('Delete all past games?')) {
                this.pastGames = [];
                storage.set('tichugames', JSON.stringify(this.pastGames));
                this.loadPastGames(this.pastGames);
            }
        },
        loadGame(index) {
            this.game = this.pastGames[index];
            this.showPastGames = false;
        },
        guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
    }
}
</script>

<style lang="scss">
@import "assets/sass/app.scss";
</style>
