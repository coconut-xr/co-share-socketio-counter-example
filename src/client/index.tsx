import React, { Suspense, useMemo } from "react"
import { createElement } from "react"
import ReactDOM from "react-dom"
import { useStoreSubscription } from "co-share/react"
import { CounterStore } from "../counter-store"
import create from "zustand"
import { SocketIOConnection } from "co-share-socketio/react"

const url = `${window.location.protocol}//${window.location.hostname}:8081`

function Index() {
    return (
        <SocketIOConnection fallback="Connecting ..." url={url}>
            <Suspense fallback={"Loading ..."}>
                <CounterExamplePage />
            </Suspense>
        </SocketIOConnection>
    )
}

function CounterExamplePage() {
    const store = useStoreSubscription("counter", 1000, (value: number) => new CounterStore(value))
    const useStoreState = useMemo(
        () =>
            create<{
                counter: number
            }>(store.state),
        [store]
    )

    const { counter } = useStoreState()

    return (
        <div className="p-3 d-flex flex-row align-items-center">
            <h1 className="mx-3">{counter}</h1>
            <button className="m-1 btn btn-outline-primary" onClick={() => store.increase()}>
                +
            </button>
        </div>
    )
}

ReactDOM.render(createElement(Index), document.getElementById("root"))
