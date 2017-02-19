angular.module('app', ['firebase'])
    .controller('MainCtrl', function ($scope, firebaseDataService, $firebaseObject, $firebaseArray) {
        $scope.listaFoiSelecionada = false
        let idListaSelecionada = ""
        $scope.listas = $firebaseArray(firebaseDataService.listas)
        $scope.usuarios = $firebaseArray(firebaseDataService.users)

        $scope.verLista = function (lista) {
            $scope.usuariosNestaLista = $firebaseArray(firebaseDataService.listas.child(lista).child("pessoas"))
            idListaSelecionada = lista
            $scope.listaFoiSelecionada = true
        }

        $scope.addUsuarioNaLista = function (id, nome) {
            if (id === null) {
                // Adicionar pessoas que não estão cadastradas
            } else if (nome === null) {
                let user = $firebaseObject(firebaseDataService.users.child(id))
                user.$loaded().then(res => {
                    $scope.usuariosNestaLista.$add({
                        usuario: id,
                        cadastrado: true,
                        check: false,
                        display_name: user.display_name
                    })
                }).then(response => {
                    let li = $firebaseObject(firebaseDataService.listas.child(idListaSelecionada))
                    li.$loaded().then(r => {
                        li.totalPessoas++
                        li.$save().then(re => { })
                    })
                })
            }
        }

        $scope.removerUsuario = function (pessoaID) {
            let lista = $firebaseObject(firebaseDataService.listas.child(idListaSelecionada))
            lista.$loaded().then(r => {
                let item = {}
                let pessoasNaLista = $firebaseArray(firebaseDataService.listas.child(idListaSelecionada).child("pessoas"))
                pessoasNaLista.$loaded().then(res => {
                    for (let i = 0; i < pessoasNaLista.length; i++) {
                        if (pessoasNaLista[i].$id == pessoaID) {
                            item = pessoasNaLista[i]
                            pessoasNaLista.$remove(item).then(r => {
                                lista.totalPessoas--
                                lista.$save().then((res) => { })
                            })
                        }
                    }
                })
            })
        }
    })

    .factory('firebaseDataService', function firebaseDataService() {
        var root = firebase.database().ref();
        var service = {
            root: root,
            users: root.child('usuarios'),
            listas: root.child('listas')
        };
        return service;
    })