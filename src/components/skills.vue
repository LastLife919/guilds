<template>
	<div>
		<h2>{{gtitle}}</h2>
		<v-layout justify-center row wrap>
			<v-flex xs12 sm6>
				<h3>Эффекты</h3>
				<v-card class="ma-2"
					v-for="(eff, i) in effects.effectList" :key="eff.k"
					:color="lvlup(effects.lvlup[i])">
					<div>
						<v-btn-toggle v-if="editMode">
								<v-btn small v-if="i > 0" @click="positionEffect('up',i)">
									<v-icon>arrow_upward</v-icon>
								</v-btn>
								<v-btn small v-if="i < effects.effectList.length - 1" @click="positionEffect('down',i)">
									<v-icon>arrow_downward</v-icon>
								</v-btn>
								<v-btn small @click="$emit('onRemoveEffect',i)">
									<v-icon>delete</v-icon>
								</v-btn>
						</v-btn-toggle>
						<div class="skill-icon" style="background:url(userscript/img/guilds/effects.png);"
							:style="'background-position:' + effectsList[eff.k].pos"
							></div>
						<strong>{{effectsList[eff.k].title}} {{eff.v}}</strong>
						<v-divider></v-divider>
						<i>{{effectsList[eff.k].desc}}</i>
					</div>
				</v-card>
				<v-card class="ma-2"
					v-if="editMode">
						<v-btn small class="px-0 ma-1" style="min-width:24px;"
											v-for="(newEff, i) in effectsList" :key="newEff.title"
											@click="onSelect(i)"
											:disabled="isSelected(i)">
							<div class="skill-icon" style="background:url(userscript/img/guilds/effects.png);"
								:style="'background-position:' + newEff.pos"></div>
						</v-btn>
					<br>
					<v-layout justify-center row wrap>
					<v-flex xs10 sm6>
					<v-text-field
						type="number"
						label="Уровень эффекта"
						v-model="addEffLvl"
					></v-text-field>
				</v-flex>
			</v-layout>
					<v-divider></v-divider>
					<v-btn color="teal darken-3" small @click="addEffect">Добавить</v-btn>
				</v-card>
			</v-flex>
			<v-flex xs12 sm6>
				<h3>Бонусы</h3>
				<v-card class="ma-2"
					v-for="(bon, i) in bonuses.bonusList" :key="bon.k"
					:color="lvlup(bonuses.lvlup[i])">
					<div>
						<v-btn-toggle v-if="editMode">
								<v-btn small v-if="i > 0" @click="positionBonus('up',i)">
									<v-icon>arrow_upward</v-icon>
								</v-btn>
								<v-btn small v-if="i < bonuses.bonusList.length - 1" @click="positionBonus('down',i)">
									<v-icon>arrow_downward</v-icon>
								</v-btn>
								<v-btn small @click="$emit('onRemoveBonus',i)">
									<v-icon>delete</v-icon>
								</v-btn>
						</v-btn-toggle>
						<strong>{{bonusesList[bon.k].title}} {{bon.v}}</strong>
						<v-divider></v-divider>
						<i>{{bonusesList[bon.k].desc}}</i>
					</div>
				</v-card>
				<v-card class="ma-2"
					v-if="editMode">
					<v-btn small class="px-0 ma-1" style="max-width:90%"
						v-for="(newB, i) in bonusesList" :key="newB.title"
						@click="onSelectB(i)"
						:disabled="isSelectedB(i)"
						>
						<div style="max-width:100%" class="caption text-truncate">
						{{newB.title}}
						</div>
					</v-btn>
					<br>
					<v-layout justify-center row wrap>
						<v-flex xs10 sm6>
							<v-text-field
							type="text"
							label="Значение бонуса"
							v-model="addBonVal"
							></v-text-field>
						</v-flex>
					</v-layout>
					<v-divider></v-divider>
					<v-btn color="teal darken-3" small @click="addBonus">Добавить</v-btn>
				</v-card>
			</v-flex>
		</v-layout>
		<v-divider></v-divider>
		<v-layout row justify-center>
		<v-flex xs10 md6>
			<v-card class="my-2">
				<v-card-text>
				Зелий опыта для поднятия уровня: <span v-if="!editMode">{{cost[0]}}$</span>
				<span v-else>
					<v-layout align-center justify-center row wrap>
						<v-flex xs3 sm6>
							<v-text-field type="number" label="Стоимость" v-model="cost[0]"></v-text-field>
						</v-flex>
						<v-flex xs9 sm6>
							<v-btn color="teal darken-3" small @click="$emit('onChangeCost',+cost[0])">Изменить цену</v-btn>
						</v-flex>
					</v-layout>
				</span>
				<br>
				Общее кол-во зелий опыта: {{cost[1]}}$
			</v-card-text>
			</v-card>
		</v-flex>
	</v-layout>
	</div>
</template>

<script>
	export default {
		props: ['effectsList', 'bonusesList', 'effects', 'bonuses', 'gtitle', 'editMode', 'cost'],
		data() {
			return {
				addEff: '',
				addEffLvl: '',
				addBon: '',
				addBonVal: '',
				hz: 0
			}
		},
		methods: {
			onSelect(id) {
				this.addEff = id;
			},
			isSelected(id) {
				if(id === this.addEff) {
					return true;
				}
				else {
					return false;
				}
			},
			onSelectB(id) {
				this.addBon = id;
			},
			isSelectedB(id) {
				if(id === this.addBon) {
					return true;
				}
				else {
					return false;
				}
			},
			lvlup(up) {
				if (up == true) return 'green darken-3'
			},
			addEffect() {
				if ((this.addEff != '') && (this.addEffLvl > 0)) {
					this.$emit('onAddEffect', this.addEff, this.addEffLvl);
					this.addEff = '';
					this.addEffLvl = '';
				}
			},
			addBonus() {
				if ((this.addBon != '') && (this.addBonVal != '')) {
					this.$emit('onAddBonus', this.addBon, this.addBonVal);
					this.addBon = '';
					this.addBonVal = '';
				}
			},
			positionEffect(direction, i) {
				this.$emit('onPositionEffect', direction, +i);
			},
			positionBonus(direction, i) {
				this.$emit('onPositionBonus', direction, +i);
			}
		}
	}
</script>

<style scoped>
	.skill-icon {
		margin: 2px;
		display: inline-block;
		vertical-align: middle;
		width: 18px;
		height: 18px;
	}
</style>