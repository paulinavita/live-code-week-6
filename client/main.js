var baseUrl = 'http://localhost:3000'

new Vue({
    el: '#app',
    data: {
        isLogin: false,
        loginEmail: '',
        loginPassword: '',
        nowShowingJoke: '',
        nowShowingJokeId: '',
        jokeData: '',
        arrFavorite : []

    },
    created: function () {
        if (localStorage.getItem('token')) {
            this.isLogin = true
            this.getJokes()
            this.fetchFavorites()
        }
    },
    // watch: {
    //     isLogin: function () {
    //         if (this.isLogin == true) {
    //             this.getJokes()
    //             // this.fetchFavorites()

                
    //         }
    //     }
    // }
    // ,
    methods: {
        signIn() {
            axios.post(`${baseUrl}/login`, {
                    email: this.loginEmail,
                    password: this.loginPassword
                })
                .then(response => {
                    swal({
                        title: "Signed in sucess",
                        text: "OK!",
                        icon: "success",
                    });
                    console.log(response)
                    let {
                        data
                    } = response
                    localStorage.setItem('token', data.token)
                    localStorage.setItem('email', data.email)
                    localStorage.setItem('id', data._id)

                    this.isLogin = true

                })
                .catch(err => {
                    swal("Error", "Check your credential", "error");
                })
        },
        signOut() {
            localStorage.removeItem('token')
            localStorage.removeItem('email')
            localStorage.removeItem('id')
            this.isLogin = false

            swal({
                title: "You signed out",
                text: "See you soon!",
                icon: "success",
            });
        },
        getJokes() {
            axios.get(`${baseUrl}/joke`, {
                    headers: {
                        token: localStorage.getItem('token')
                    }
                })
                .then(({ data }) => {
                    this.jokeData = data
                    this.nowShowingJoke = data.joke
                    this.nowShowingJokeId = data.id
                })
                .catch((err) => {
                    swal("Error", "Something is wrong", "error");
                })
        },
        addToFavorite() {
            let inputJoke = this.jokeData
            axios.post(`${baseUrl}/favorites`, {
                joke : inputJoke.joke,
                jokeId : inputJoke.id
            }, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then((data) => {
                // console.log(data)
                this.arrFavorite.push(data)
                this.getJokes()
                this.fetchFavorites()
            })
            .catch(err => {
                console.log(err.response)
                swal("Error", "Something is wrong", "error");
            })
        },
        fetchFavorites() {
            console.log('bisaaa')

            axios.get(`${baseUrl}/mine`,{
                headers : {
                token : localStorage.getItem('token')
                }
            })
            .then((response) => {
            console.log(response, './/????////')
            // this.arrFavorite = data
            })
            .catch(err => {
            console.log(err.response, 'disni?')
            })

        },
        removeFavorites(id) {
            axios.delete(`${baseUrl}/delete/${id}`, {
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            .then(({data}) => {
                // this.arrFavorite = data
                this.getJokes()
                this.fetchFavorites()
            })
            .catch(err => {
                // console.log(err.response, '///')
                swal("Error", "Something is wrong", "error");
            })
        }
    }
})