'use strict'

const vm = require('vm')
const teoria = require('teoria')

let sandbox

module.exports = (cmd, context, filename, callback) => {
    // make a proxy of context, allowing us to guess notes
    const contextProxy = {
        get(target, name) {
            if (name in global) return global[name]
            else if (!(name in target) || /^fs$/i.test(name)) {
                // replace "s" in the middle of a 2-3 char note string with a sharp
                const adjustedForSharp = name.replace(/^([a-g])s($|(?=[0-8]$))/i, '$1#')
                let note
                try {
                    note = new teoria.note(adjustedForSharp).toString()
                } catch (e) {
                    throw Error(`Unrecognized input: "${name}"`)
                }
                return note
            } else return target[name]
        }
    }

    sandbox = sandbox || vm.createContext(new Proxy(context, contextProxy))
    const result = vm.runInContext(cmd, sandbox)
    callback(null, result)
}
