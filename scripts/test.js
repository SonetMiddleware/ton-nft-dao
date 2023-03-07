const TonWeb = require("tonweb");

const addr = new TonWeb.Address("UQAgTu/o53RUWS7+mMNt65zMoE4qkbQvAmD47uUQQsm7pf0B");
console.log(addr.toString(true))
console.log(addr.toString(true, true))
console.log(addr.toString(true, true, true))
console.log(addr.toString(true, true, false))
