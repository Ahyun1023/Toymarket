module.exports = (()=> {
    return {
        local: { //개발 서버용
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: 'fkrtmgkswks',
            database: 'toymarket'
        },

        real: { //실 서버용
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        },

        dev: { //테스트 서버용
            host: '',
            port: '',
            user: '',
            password: '',
            database: ''
        }
    }
})();