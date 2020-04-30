export default class Store {

  constructor(statesModules, actionsModules) {

    this.state = {}
    this.action = {}

    if (typeof statesModules !== 'object' || statesModules === null) {
      throw new Error('statesModules 应为一个有效的对象')
    }

    if (typeof actionsModules !== 'object' || actionsModules === null) {
      throw new Error('actionsModules 应为一个有效的对象')
    }

    // state
    Object.keys(statesModules).forEach((key) => {
      const module = statesModules[key]
      Object.keys(module).forEach(stateName => {
        this.state[stateName] = module[stateName]
      })
    })

    // action
    Object.keys(actionsModules).forEach((key) => {
      const module = actionsModules[key]
      Object.keys(module).forEach(actionName => {
        this.action[actionName] = (...args) => {
          return module[actionName]({
            state: this.state,
            action: this.action,
          }, ...args)
        }
      })
    })
  }

  /**
   * 状态管理--state
   * 
   * 用法: 
     ```
     Store.get('stateName')
     ```
   * 
   * 配置:
     ```
     const state = { 
     // any state
     }```
   */
  get(key) {
    return this.state[key]
  }

  /**
   * 状态管理--action
   * 
   * 用法: 
     ```
     Store.dispath(actionName, payload)
     ```
   * 
   * 配置:
     ```
     const action = { 
     // any action 
     // 第一个参数可选择传入state和action，否则为{}
     } 
     ```
   */
  dispatch(actionName, payload) {
    return this.action[actionName](payload)
  }

}
