<template>
	<div>
		<v-layout align-center justify-center row wrap>
			<v-flex xs6 sm4 md2 v-for="(guild, i) in guilds" :key="guild.name">
				<v-btn-toggle v-if="editMode">
									<v-btn small v-if="i > 0" @click="$emit('onPositionGuild','up',i)">
										<v-icon>arrow_upward</v-icon>
									</v-btn>
									<v-btn small v-if="i < guilds.length - 1" @click="$emit('onPositionGuild','down',i)">
										<v-icon>arrow_downward</v-icon>
									</v-btn>
									<v-btn small v-if="guilds.length > 1" @click="$emit('onRemoveGuild',i)">
										<v-icon>delete</v-icon>
									</v-btn>
				</v-btn-toggle>
				<v-btn class="px-1 mx-3" style="width:90%"
				:class="textSize"
				@click="select(i)"
				:disabled="isSelected(i)">
				
					<v-img aspect-ratio="1"
								:min-width="imageSize"
								:max-width="imageSize"
								:src="guild.icon"></v-img>
					{{ guild.name }}
				</v-btn>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
	export default{
		props: ['guilds', 'editMode'],
		data () {
			return {
				active: 0
			}
		},
		computed: {
			imageSize() {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs': return '18px'
					case 'sm': return '18px'
					case 'md': return '30px'
					case 'lg': return '30px'
					case 'xl': return '30px'
				}
				return '';
			},
			textSize() {
				switch (this.$vuetify.breakpoint.name) {
					case 'xs': return 'caption'
					case 'sm': return 'caption'
					case 'md': return ''
					case 'lg': return ''
					case 'xl': return ''
				}
				return '';
			}
		},
		methods: {
			select(id) {
				if (this.active != id) {
					this.active = id;
					this.$emit('onSelectGuild', id);
				}
			},
			isSelected(id){
				if(id === this.active) {
					return true;
				}
				else{
					return false;
				}
			}
	},
}
</script>