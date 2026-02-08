import { State, StateContext, Selector, Store, Action } from '@ngxs/store';
import { Injectable } from "@angular/core";
import { Pedido } from '../models/pedido';

export class SetPedidosAction {
    static readonly type = '[Pedido] Set Pedidos';
    constructor(public pedido: Pedido) { }
}

export class BuscarPedidosAction {
    static readonly type = '[Pedidos] Buscar';

    constructor() { }
}



export class PedidoStateModel {
    public pedido!: Pedido;
}

const pedidoStateModel: PedidoStateModel = {
    pedido: new Pedido(),
};

@State<PedidoStateModel>({
    name: 'Pedido',
    defaults: pedidoStateModel
})

@Injectable({ providedIn: 'root' })
export class PedidoState {

    constructor() { }

    @Selector()
    static getPedido(state: PedidoStateModel): Pedido {
        return state.pedido;
    }

    @Action(SetPedidosAction)
    setPedidos(ctx: StateContext<PedidoStateModel>, action: SetPedidosAction) {
        ctx.setState({ pedido: action.pedido });
    }
}
