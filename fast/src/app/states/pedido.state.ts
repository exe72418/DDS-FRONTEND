  // Importa el modelo de Pedido
  import { State, StateContext, Selector, Store, Action } from '@ngxs/store';
import { Injectable } from "@angular/core";
import { Pedido } from "../models/pedido";

// Acciones
export class SetPedidosAction {
    static readonly type = '[Pedido] Set Pedidos';
    constructor(public pedido: Pedido) {}  // Recibe un array de pedidos
}

export class BuscarPedidosAction {
    static readonly type = '[Pedidos] Buscar';

    constructor() {}
}


// Modelo del estado
export class PedidoStateModel {
    public pedido!: Pedido;  // Un array de Pedido
}

const pedidoStateModel: PedidoStateModel = {
    pedido: new Pedido(),   // Inicializar con un array vacío
};

@State<PedidoStateModel>({
    name: 'Pedido',
    defaults: pedidoStateModel
})

@Injectable({providedIn:'root'})
export class PedidoState {

    constructor() { }

    // Selector para obtener el estado completo del pedido
    @Selector()
    static getPedido(state: PedidoStateModel): Pedido {
        return state.pedido;
    }

    // Acción para establecer un nuevo pedido
    @Action(SetPedidosAction)
    setPedidos(ctx: StateContext<PedidoStateModel>, action: SetPedidosAction) {
        ctx.setState({ pedido: action.pedido });
    }   
}
