<template>
    <div class="new-style">
      <h1>Create New Style</h1>

      <form class="create-style" @submit="postData" method="post">

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
import axios from 'axios';

import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    data(){
        const create_style_form = ref({});
        const store = useStore();

        const createStyle = () => {
            store.dispatch('create_style', create_style_form.value);
        }

        return{
            create_style_form,
            createStyle
        }
    },
    methods:{
        postData(e){
            axios.post("http://localhost:3000/api/v1/styles/", this.postData)
                .then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err.response);
                }
            );
            e.preventDefault();
        }
    }
    // setup () {
    //     const create_style_form = ref({});
    //     const store = useStore();

    //     const createStyle = () => {
    //         store.dispatch('create_style', create_style_form.value);
    //     }

    //     return{
    //         create_style_form,
    //         createStyle
    //     }
    // }
}
</script>

<style>

</style>
  