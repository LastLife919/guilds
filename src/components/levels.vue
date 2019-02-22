<template>
	<div>
	<h2>Уровни</h2>
	<div v-if="levels">
		<v-badge color="red darken-4"
						overlap
						v-for="(level, i) in levels" :key="i"
		>
			<v-icon slot="badge" dark small
						v-if="editMode && i>0"
						@click="removeLevel(i)"
			>delete</v-icon>
			<v-btn small class="px-0 ma-2" style="min-width:32px"
						@click="select(i)"
						:disabled="isSelected(i)"
			>
			<div>
						{{i+1}}
			</div>
				
			</v-btn></v-badge>
			<v-btn small class="px-0 ma-1"  style="min-width:32px"
				v-if="editMode"
				@click="$emit('onAddLevel')"
			>+</v-btn>
		</div>
	</div>
</template>

<script>
	export default{
		props: ['levels', 'editMode', 'selectedLevel'],
		data () {
			return {
			}
		},
		methods: {
			select(id) {
				this.$emit('onSelectLevel', id);
			},
			isSelected(id) {
				if(id === this.selectedLevel){
					return true;
				}
				else{
					return false;
				}
			},
			removeLevel(i) {
				this.select(0);
				this.$emit('onRemoveLevel',i)
			}
		}
	}
</script>

<style>

</style>