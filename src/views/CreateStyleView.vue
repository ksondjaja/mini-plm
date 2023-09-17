<template>
    <div class="new-style">
      <h1>Create New Style</h1>

      <form class="create-style" @submit.prevent="createStyle">

                <input
                    type="text"
                    placeholder="Style Name"
                    v-model="create_style_form.name"
                /><br/>

                <input
                    type="text"
                    placeholder="Style Number"
                    v-model="create_style_form.number"
                /><br/>

                <input
                    type="text"
                    placeholder="Season"
                    v-model="create_style_form.season"
                /><br/>

                <input
                    type="text"
                    placeholder="Category"
                    v-model="create_style_form.category"
                /><br/>

                <input
                    type="text"
                    placeholder="Size Range"
                    v-model="create_style_form.sizeRange"
                /><br/>

                <input
                    type="date"
                    placeholder="Delivery Date"
                    v-model="create_style_form.deliveryDate"
                /><br/>

                <input
                    type="submit"
                    value="Create Style"
                />    
            </form>
    </div>
  </template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    setup () {
        const create_style_form = ref({});
        const store = useStore();

        const createStyle = () => {
            store.dispatch('create_style', create_style_form.value);
        }

        return{
            create_style_form,
            createStyle
        }
    }
}
</script>

<style>

</style>
  