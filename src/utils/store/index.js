import { Store } from './core/index'
import * as states from './states/index'
import * as actions from './actions/index'

export default new Store(states, actions)