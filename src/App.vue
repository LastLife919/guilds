<template>
	<div>
		<v-app dark>
			<v-navigation-drawer v-model="menu" fixed dark temporary>
				<v-list class="pa-1">
					<v-list-tile @click.stop="menu = !menu">
						<v-list-tile-action>
							<v-icon>chevron_left</v-icon>
						</v-list-tile-action>
						<v-list-tile-content>
							<v-list-tile-title>Скрыть</v-list-tile-title>
						</v-list-tile-content>
					</v-list-tile>
					<v-list-tile>
						<v-list-tile-content>
							<v-list-tile-title>Включить редактирование</v-list-tile-title>
						</v-list-tile-content>
						<v-list-tile-action>
							<v-switch v-model="editMode"></v-switch>
						</v-list-tile-action>
					</v-list-tile>
				</v-list>
				<v-divider light></v-divider>
				<v-list class="pa-1" v-if="editMode">
					<v-list-group>
						<v-list-tile slot="activator">
							<v-list-tile-title>Создание гильдии</v-list-tile-title>
						</v-list-tile>
						<v-form>
							<v-container fluid text-xs-center>
								<v-layout row wrap>
									<v-flex xs12 class="py-0" >
										<v-text-field  type="text" label="Название" v-model="newGuildName"></v-text-field>
									</v-flex>
									<v-flex xs5 class="py-0">
										<v-text-field type="text" label="Сокращение" v-model="newGuildChar"></v-text-field>
									</v-flex>
									<v-flex xs7 class="py-0">
										<v-text-field type="number" label="Кол-во уровней" v-model="newGuildLevels"></v-text-field>
									</v-flex>
									<v-btn color="teal darken-3" @click="createGuild()">Создать</v-btn>
									<v-btn @click="cancelCreate()">Отмена</v-btn>
								</v-layout>
							</v-container>
						</v-form>
					</v-list-group>
					<v-list-group>
						<v-list-tile slot="activator">
							<v-list-tile-title>Создание бонуса</v-list-tile-title>
						</v-list-tile>
						<v-form>
							<v-container fluid text-xs-center>
								<v-layout row wrap>
									<v-flex xs4 class="py-0">
										<v-text-field  type="text" label="Id" v-model="newBonusId"></v-text-field>
									</v-flex>
									<v-flex xs8 class="py-0">
										<v-text-field type="text" label="Название" v-model="newBonusTitle"></v-text-field>
									</v-flex>
									<v-flex xs12 class="py-0">
										<v-text-field type="text" label="Описание" v-model="newBonusDesc"></v-text-field>
									</v-flex>
									<v-btn color="teal darken-3" @click="createBonus()">Создать</v-btn>
									<v-btn @click="cancelCreate()">Отмена</v-btn>
								</v-layout>
							</v-container>
						</v-form>
					</v-list-group>
					<v-list-group>
						<v-list-tile slot="activator">
							<v-list-tile-title>Изменить данные</v-list-tile-title>
						</v-list-tile>
						<v-container fluid text-xs-center>
							<v-layout row wrap>
								<v-flex xs12 class="py-0">
									<v-textarea box readonly label="Текущие данные" v-model="getCurrentData" @click="copyToClipboard(getCurrentData)"></v-textarea>
								</v-flex>
								<v-flex xs12 class="py-0">
									<v-textarea box label="Новые данные" v-model="jsonG"></v-textarea>
								</v-flex>
								<v-btn color="teal darken-3" @click="reGuild">Применить</v-btn>
							</v-layout>
						</v-container>
					</v-list-group>
				</v-list>
			</v-navigation-drawer>
			<v-snackbar v-model="copyMessage" left multi-line>Данные скопированы
					<v-btn color="pink" flat @click="copyMessage = false">
						Закрыть
					</v-btn>
				</v-snackbar>
			<v-toolbar flat>
				<v-toolbar-side-icon @click="menu = !menu"></v-toolbar-side-icon>
				<v-toolbar-title>Гильд-Таблица</v-toolbar-title>
			</v-toolbar>
			<v-container fluid text-xs-center>
					<list :guilds="getList"
								:editMode="editMode"
								@onSelectGuild="selectGuild"
								@onRemoveGuild="removeGuild"
								@onPositionGuild="positionGuild"
					></list>
					<br>
					<v-divider></v-divider>
				<v-layout row wrap>
					<v-flex xs12 md4 class="py-2">
						<levels :levels="getLevelsCount"
										:selectedLevel="selectedLevel"
										:editMode="editMode"
										@onSelectLevel="selectLevel"
										@onAddLevel="addLevel"
										@onRemoveLevel="removeLevel"
						></levels>
					</v-flex>
					<v-flex xs12 md8 class="py-2">
						<skills :effectsList="effects"
										:bonusesList="bonuses"
										:effects="getEffects"
										:bonuses="getBonuses"
										:gtitle="getTitle"
										:cost="getCost"
										:editMode="editMode"
										@onAddEffect="addEffect"
										@onAddBonus="addBonus"
										@onRemoveEffect="removeEffect"
										@onRemoveBonus="removeBonus"
										@onChangeCost="changeCost"
										@onPositionEffect="positionEffect"
										@onPositionBonus="positionBonus"
						></skills>
					</v-flex>
				</v-layout>
			</v-container>
		</v-app>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				effects: {
					speed: {
						title: 'Скорость',
						desc: 'Увеличивает скорость передвижения на 20% за уровень',
						pos: '-0px -0px'
					},
					slowness: {
						title: 'Замедление',
						desc: 'Уменьшает скорость передвижения на 15% за уровень',
						pos: '-18px -0px'
					},
					haste: {
						title: 'Спешка',
						desc: 'Блоки ломаются быстрее на 20 % за уровень',
						pos: '-36px -0px'
					},
					mining_fatigue: {
						title: 'Усталость',
						desc: 'Блоки ломаются медленнее на 20 % за уровень',
						pos: '-54px -0px'
					},
					strength: {
						title: 'Сила',
						desc: 'Увеличивает урон всех атак ближнего боя на 3 за уровень',
						pos: '-72px -0px'
					},
					weakness: {
						title: 'Слабость',
						desc: 'Уменьшает силу атаки на 1 за уровень',
						pos: '-90px -0px'
					},
					poison: {
						title: 'Отравление',
						desc: 'Наносит 1 урона каждые 25 тактов, но не убивает, интервал уменьшается вдвое за уровень',
						pos: '-108px -0px'
					},
					regeneration: {
						title: 'Регенерация',
						desc: 'Восстанавливает 1 ед. здоровья каждые 50 тактов, интервал уменьшается вдвое за уровень',
						pos: '-126px -0px'
					},
					invisibility: {
						title: 'Невидимость',
						desc: 'Делает модель игрока невидимой, броня не становится невидимой',
						pos: '-0px -18px'
					},
					hunger: {
						title: 'Голод',
						desc: 'Увеличивает скорость истощения. Каждый уровень добавляет 0,025 к уровню истощения за такт',
						pos: '-18px -18px'
					},
					jump_boost: {
						title: 'Прыгучесть',
						desc: 'Увеличивает высоту прыжка, уменьшает урон от падения на 1 за уровень',
						pos: '-36px -18px'
					},
					nausea: {
						title: 'Тошнота',
						desc: 'Заставляет изображение «плавать», как при входе в портал',
						pos: '-54px -18px'
					},
					night_vision: {
						title: 'Ночное зрение',
						desc: 'Увеличивает яркость и улучшает видимость в воде',
						pos: '-72px -18px'
					},
					blindness: {
						title: 'Слепота',
						desc: 'Создает густой чёрный туман вокруг игрока, не позволяет бежать и наносить критические удары',
						pos: '-90px -18px'
					},
					resistance: {
						title: 'Сопротивление',
						desc: 'Уменьшает весь получаемый урон на 20 % за уровень',
						pos: '-108px -18px'
					},
					fire_resistance: {
						title: 'Огнестойкость',
						desc: 'Делает игрока невосприимчивым к огню и лаве',
						pos: '-126px -18px'
					},
					water_breathing: {
						title: 'Подводное дыхание',
						desc: 'Под водой количество воздуха не уменьшается, улучшает видимость под водой',
						pos: '-0px -36px'
					},
					wither: {
						title: 'Иссушение',
						desc: 'Наносит 1 урона каждые 40 тактов, интервал уменьшается вдвое за уровень',
						pos: '-18px -36px'
					},
					levitation: {
						title: 'Левитация',
						desc: 'Игрок непроизвольно взлетает',
						pos: '-54px -36px'
					},
					glowing: {
						title: 'Свечение',
						desc: 'Сущность и всё, что она держит, становится полностью белой и светится, это видно даже сквозь непрозрачные блоки',
						pos: '-72px -36px'
					},
					luck: {
						title: 'Удача',
						desc: 'Увеличивает навык рыбалки',
						pos: '-90px -36px'
					},
					bad_luck: {
						title: 'Невезение',
						desc: 'Уменьшает навык рыбалки',
						pos: '-108px -36px'
					},
					absorption: {
						title: 'Поглощение',
						desc: 'К общему значению здоровья прибавляются дополнительные 2 сердца за уровень. Изначально заполнены, но при получении игроком урона они исчезают',
						pos: '-126px -36px'
					},
					health_boost: {
						title: 'Прилив здоровья',
						desc: 'К общему значению здоровья прибавляются дополнительные 2 сердца за уровень. Изначально пустые и восстанавливаются, как если бы это было обычное здоровье',
						pos: '-0px -54px'
					},
					dolphins_grace: {
						title: 'Дельфинья грация',
						desc: 'Ускоряет плаванье игрока',
						pos: '-18px -54px'
					},
					conduit_power: {
						title: 'Морская сила',
						desc: 'При наложении на игрока его зрение под водой улучшится, увеличится скорость копания под водой, а также шкала воздуха тратиться не будет',
						pos: '-36px -54px'
					},
					slow_falling: {
						title: 'Медленное падение',
						desc: 'Позволяет игроку снижаться медленнее, чем обычно и не получать урон от падения',
						pos: '-54px -54px'
					}
				},
				bonuses: {
				},
				guilds: [
					{name: '?',char: '?',icon: 'userscript/img/guilds/none.png',levels: [{}]}
				],
				selectedGuild: 0,
				selectedLevel: 0,
				editMode: false,
				menu: false,
				copyMessage: false,
				newBonusId: '',
				newBonusTitle: '',
				newBonusDesc: '',
				newGuildName: '',
				newGuildLevels: '',
				newGuildChar: '',
				jsonG: ''
			}
		},
		mounted: function() {
			var self = this;
			fetch('userscript/guilds.json')
			.then(function(response) {
				return response.json();
			})
			.then(function(guildsData) {
				self.bonuses = guildsData.bonuses;
				self.guilds = guildsData.guilds;
			});
		},
		computed: {
			getCurrentData() {
				let json = '{"bonuses":' + JSON.stringify(this.bonuses) + ',"guilds":' + JSON.stringify(this.guilds) + '}';
				return json
			},
			getLevelsCount() {
				return (this.guilds[this.selectedGuild].levels.length)
			},
			getList() {
				let arr = [];
				this.guilds.forEach(function(item) {
					arr.push({
						'name': item.name,
						'icon': item.icon
					});
				});
				return (arr);
			},
			getCost() {
				let cost = [0, 0], i;
				cost[0] = this.guilds[this.selectedGuild].levels[this.selectedLevel].cost;
				for (i = 0; i < (this.selectedLevel + 1); i++) {
					if (this.guilds[this.selectedGuild].levels[i].cost) {
						cost[1] += this.guilds[this.selectedGuild].levels[i].cost;
					}
				}
				return cost
			},
			getEffects() {
				let currentLevel = this.guilds[this.selectedGuild].levels[this.selectedLevel].effects;
				let lvlup = [];
				if (this.selectedLevel >= 1) {
					let i, j, up;
					let prevLevel = this.guilds[this.selectedGuild].levels[this.selectedLevel - 1].effects;
					for (i = 0; i < currentLevel.length; i++) {
						up = true;
						for (j = 0; j < prevLevel.length; j++) {
							if ((currentLevel[i].k == prevLevel[j].k) && (currentLevel[i].v == prevLevel[j].v)) {
								up = false;
							}
						}
						lvlup[i] = up;
					}
				}
				return ({effectList: currentLevel, lvlup: lvlup})
			},
			getBonuses() {
				let currentLevel = this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses;
				let lvlup = [];
				if (this.selectedLevel >= 1) {
					let i, j, up;
					let prevLevel = this.guilds[this.selectedGuild].levels[this.selectedLevel - 1].bonuses;
					for (i = 0; i < currentLevel.length; i++) {
						up = true;
						for (j = 0; j < prevLevel.length; j++) {
							if ((currentLevel[i].k == prevLevel[j].k) && (currentLevel[i].v == prevLevel[j].v)) {
								up = false;
							}
						}
						lvlup[i] = up;
					}
				}
				return ({bonusList: currentLevel, lvlup: lvlup})
			},
			getTitle() {
				if (this.selectedLevel >= 0) {
					return (this.guilds[this.selectedGuild].char + '-' + this.romanize(this.selectedLevel + 1));
				}
				return '';
			}
		},
		methods: {
			selectGuild(id) {
				this.selectedGuild = +id;
				this.selectedLevel = 0;
			},
			removeGuild(id) {
				this.guilds.splice(id, 1);
			},
			positionGuild(direction, i) {
				let temp = JSON.stringify(this.guilds[i]);
				if (direction == 'down') {
					this.guilds.splice(i, 1);
					this.guilds.splice(i+1, 0, JSON.parse(temp));
				}
				else {
					this.guilds.splice(i, 1);
					this.guilds.splice(i-1, 0, JSON.parse(temp));
				}
			},
			selectLevel(id) {
				this.selectedLevel = +id;
			},
			addLevel() {
				let n = JSON.stringify(this.guilds[this.selectedGuild].levels[this.guilds[this.selectedGuild].levels.length - 1]);
				this.guilds[this.selectedGuild].levels.push(JSON.parse(n));
			},
			removeLevel(i) {
				this.guilds[this.selectedGuild].levels.splice(i, 1);
			},
			addEffect(e, lvl) {
				this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.push({
					k: e,
					v: lvl
				})
			},
			removeEffect(i) {
				this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.splice(i, 1);
			},
			positionEffect(direction, i) {
				let temp = JSON.stringify(this.guilds[this.selectedGuild].levels[this.selectedLevel].effects[i]);
				if (direction == 'down') {
					this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.splice(i, 1);
					this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.splice(i+1, 0, JSON.parse(temp));
				}
				else {
					this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.splice(i, 1);
					this.guilds[this.selectedGuild].levels[this.selectedLevel].effects.splice(i-1, 0, JSON.parse(temp));
				}
			},
			positionBonus(direction, i) {
				let temp = JSON.stringify(this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses[i]);
				if (direction == 'down') {
					this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.splice(i, 1);
					this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.splice(i+1, 0, JSON.parse(temp));
				}
				else {
					this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.splice(i, 1);
					this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.splice(i-1, 0, JSON.parse(temp));
				}
			},
			addBonus(b, v) {
				this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.push({
					k: b,
					v: v
				})
			},
			removeBonus(i) {
				this.guilds[this.selectedGuild].levels[this.selectedLevel].bonuses.splice(i, 1);
			},
			changeCost(val) {
				this.guilds[this.selectedGuild].levels[this.selectedLevel].cost = val;
			},
			createGuild() {
				if ((this.newGuildName == '') || (this.newGuildChar == '') || (this.newGuildLevels < 1)) return;
				let newGuild = {
					name: this.newGuildName,
					char: this.newGuildChar,
					icon: 'userscript/img/guilds/none.png',
					levels: []
				}
				let i = 0;
				for (i; i < this.newGuildLevels; i++) {
					newGuild.levels.push({
						cost: 0,
						effects: [],
						bonuses: []
					})
				}
				this.guilds.push(newGuild);
				this.cancelCreate();
			},
			createBonus() {
				if ((this.newBonusTitle == '') || (this.newBonusId == '') || (this.newBonusDesc == '')) return;
				let newBonus = {
					title: this.newBonusTitle,
					desc: this.newBonusDesc
				}
				this.bonuses[this.newBonusId] = newBonus;
				this.cancelCreate();
			},
			cancelCreate() {
				this.newGuildName = '';
				this.newGuildChar = '';
				this.newGuildLevels = '';
				this.newBonusTitle = '';
				this.newBonusDesc = '';
				this.newBonusId = '';
			},
			romanize(num) {
				let lookup = {
					M: 1000,
					CM: 900,
					D: 500,
					CD: 400,
					C: 100,
					XC: 90,
					L: 50,
					XL: 40,
					X: 10,
					IX: 9,
					V: 5,
					IV: 4,
					I: 1
				},
				roman = '',
				i;
				for (i in lookup) {
					while (num >= lookup[i]) {
						roman += i;
						num -= lookup[i];
					}
				}
				return roman;
			},
			reGuild() {
				this.selectedLevel = 0;
				this.selectedGuild = 0;
				this.guilds = JSON.parse(this.jsonG).guilds;
				this.bonuses = JSON.parse(this.jsonG).bonuses;
			},
			copyToClipboard(str) {
				this.copyMessage = true;
				const el = document.createElement('textarea');
				el.value = str;
				el.setAttribute('readonly', '');
				el.style.position = 'absolute';
				el.style.left = '-9999px';
				document.body.appendChild(el);
				el.select();
				document.execCommand('copy');
				document.body.removeChild(el);
			}
		}
	}
</script>

<style>
</style>