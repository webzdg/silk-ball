export function warn(msg){
    console.error(`[SilkBall warn]: ${msg}`)
}

export function throwError(msg){
    throw new Error(`[SilkBall warn]: ${msg}`)
}

export function log(msg){
    console.log(msg)
}