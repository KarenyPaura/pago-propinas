<script setup lang="ts">
import 'bootstrap/dist/css/bootstrap.css';
import { ref } from 'vue';
import axios from 'axios';


const pago = ref<string>("0.00");
const totalPagado = ref<string>("0.00");
const pagadoData = ref<number>(0);
const porPagar = ref<string>("0.00");
const porPers = ref<string>("0.00");
const propData = ref<number>(0);
const propString = ref<string>("0.00");
const divP = ref<number>(0);
const personas = ref<number>(0);
const tipoPago = ref<number>(0);
const editPropData = ref<boolean>(false);
const permitido = ref<boolean>(true);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const historial = ref<string[]>([]);



const editProp = (data: string) => {
  if(pago.value === '0.00'){
    if(data !== '.' && data !== '0'){
      pago.value = data;
    }
  }else{
    if(data === '.'){
      const tieneDecimal = pago.value.includes('.');
      if(tieneDecimal === false){
        pago.value += data;
      }
    }else{
      pago.value += data;
    }
  }
};


const guardarProps = async () => {
  try {
    const response = await axios.post('http://localhost:3001/guardarProps', 
      {
        valor: propData.value
      }, 
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: false
      }
    );

    propString.value = response.data.valorString;
    porPagar.value = response.data.valorString;
    editPropData.value = false;

  } catch (error) {
    console.error('Error completo:', error);
    if (axios.isAxiosError(error)) {
      console.log('Código de estado HTTP:', error.response?.status);
      console.log('Mensaje de error:', error.message);
    }
  }
};

const enviarPropina = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.post('http://localhost:3001/pago', {
      pago: pago.value,
      tipoPago: tipoPago.value,
      porPagar: porPagar.value,
      totalPagado: totalPagado.value,
    });

    permitido.value = response.data.permitido;

    if(permitido.value){
      if(pago.value !== '0.00'){
        porPagar.value = response.data.total;
        totalPagado.value = response.data.pagado;
        pagadoData.value = response.data.totalPag;
        pago.value = '0.00';
        tipoPago.value = 0;
        historial.value.push(response.data.text);
      }
    }else{
      error.value = response.data.alerta;
    }

  } catch (err) {
    if (axios.isAxiosError(err)) {
      error.value = err.response?.data?.message || 'Error al enviar los datos';
    } else {
      error.value = 'Error desconocido';
    }
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const deleteProp = () => {
  if (pago.value.length > 0 && pago.value !== "0.00") {
    pago.value = pago.value.slice(0, -1);
    if (pago.value === "" || pago.value === "0") {
      pago.value = "0.00";
    }
  }
};

const calculoPP = () => {
  if(Number.isFinite(personas.value) && personas.value > 0){
    divP.value = propData.value / personas.value;
    porPers.value = divP.value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
};


</script>
<!-- <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" /> -->
<template>
  <div class="full-viewport">
    <h1 class="green">Pago de Propinas</h1>
    <hr>
    <br>
    <div class="row">
      <div class="col-4">
        <h3 v-if="!editPropData">
          <span class="badge text-bg-danger">$ {{ propString }} </span>
          <button 
            type="button" 
            class="btn btn-light"
            @click="editPropData = true"
            ><i class="bi bi-pencil"></i>
          </button>
        </h3> 
        <div v-if="editPropData">
          <input 
            v-model="propData" 
            type="number" 
            placeholder="Ingresa monto"
          >
          <br><br>
          <button 
            type="button" 
            class="btn btn-primary me-3"
            @click="guardarProps"
            > Guardar
          </button>
          <button 
            type="button" 
            class="btn btn-danger me-3"
            @click="editPropData = false"
            > Cancelar
          </button>
        </div>
        <br>
        <br>
        <h5>¿Entre cúantos quieres dividir las pago?</h5>
        <br>
        <input 
          v-model="personas" 
          type="number" 
          placeholder="#"
          @change="calculoPP()"
        > ${{ porPers }} por persona
        <br>
        <br>
        <br>
        <br>
        <h5>Elige el método de pago</h5>
        <br>
        <button v-if="tipoPago != 1" type="button" class="btn btn-outline-success btn-lg me-4" @click="tipoPago = 1"> <i class="bi bi-cash-coin"><br></i> Efectivo </button>
        <button v-if="tipoPago == 1" type="button" class="btn btn-success btn-lg me-4"> <i class="bi bi-cash-coin"><br></i> Efectivo </button>
        <button v-if="tipoPago != 2" type="button" class="btn btn-outline-success btn-lg me-4"  @click="tipoPago = 2"> <i class="bi bi-credit-card"><br></i> BBVA</button>
        <button v-if="tipoPago == 2" type="button" class="btn btn-success btn-lg me-4"> <i class="bi bi-credit-card"><br></i> BBVA</button>
        <button v-if="tipoPago != 3" type="button" class="btn btn-outline-success btn-lg me-4"  @click="tipoPago = 3"> <i class="bi bi-credit-card"><br></i> Santander</button>
        <button v-if="tipoPago == 3" type="button" class="btn btn-success btn-lg me-4"> <i class="bi bi-credit-card"><br></i> Santander</button>
      </div>
      <div class="col-3">
        <div class="card p-4">
          <div class="container-fluid">
            <div class="row justify-content-center g-3 mb-3">
              <div class="col-9 text-end">
                $ {{ pago }}
              </div>
              <div class="col-3 text-center">
                <button 
                  type="button" 
                  class="btn btn-light btn-sm"
                  @click="deleteProp"
                  ><i class="bi bi-backspace"></i>
                </button>
              </div>
              <hr>
            </div>
            <div class="row justify-content-center g-3 mb-3">
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('1')">1</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('2')">2</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('3')">3</button>
              </div>
            </div>
            <div class="row justify-content-center g-3 mb-3">
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('4')">4</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('5')">5</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('6')">6</button>
              </div>
            </div>
            <div class="row justify-content-center g-3 mb-3">
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('7')">7</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('8')">8</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('9')">9</button>
              </div>
            </div>
            <div class="row justify-content-center g-3">
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('0')">0</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-secondary btn-lg px-4" @click="editProp('.')">.</button>
              </div>
              <div class="col-auto">
                <button type="button" class="btn btn-success btn-lg px-4" :disabled="tipoPago === 0" @click="enviarPropina">ok</button>
              </div>
            </div>
          </div>
          <div v-if="!permitido" class="alert alert-danger" role="alert">
            {{ error }} 
          </div>
        </div>
      </div>
      <div class="col-1"></div>
      <div class="col-4">
        <h4>Pagos</h4>
        <div v-for="(item, idx) in historial" :key="idx">
          <i class="bi bi-check-circle"></i> {{ item }}
        </div>
      </div>
    </div>
    <br>
    <br>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-5">
        <div class="row">
          <div class="col">
            <h4>Total Pagado</h4> 
            <h4>Restante por Pagar</h4> 
          </div>
          <div class="col">
            <h4>${{ totalPagado }}</h4>
            <h4>${{ porPagar }}</h4>
          </div>
        </div>
      </div>
      <div class="col-6 text-center">
        <button v-if="pagadoData === 0" type="button" class="btn btn-outline-secondary btn-lg">Pagar Propinas</button>
        <button v-else type="button" class="btn btn-outline-danger btn-lg">Pagado ${{ totalPagado }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.full-viewport {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  overflow: auto;
  margin: 0;
  padding: 20px;
}
</style>
