<script>
    import {Router, Route, link} from 'svelte-routing'
    import Home from './Home.svelte'
    import List from './List.svelte'
</script>

<main>
    <Router>
        <Route path="/:listId" component={List}>
        </Route>
        <Route path="/">
            <Home/>
        </Route>
    </Router>
</main>
