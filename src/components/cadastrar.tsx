import React from 'react';
import { FiEye } from 'react-icons/fi';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import logoImg from '../assets/images/boxicon.png';
import LoginFacebook from '../components/facebook';
import api from '../services/api';
import { ApplicationState } from '../store';
import * as UserActions from '../store/ducks/users/actions';
import { UserData } from '../store/ducks/users/types';
import '../styles/global.css';
import '../styles/pages/cadastrar.css';


interface Stateprops {
    users: UserData,
}

interface DispatchProps {
    loadRequest(): void,
}

interface Ownprops {
    display: boolean
}

type Props = Stateprops & DispatchProps & Ownprops

class Cadastrar extends React.Component<Props> {
    private pwInput: React.RefObject<HTMLInputElement>;
    private nomeInput: React.RefObject<HTMLInputElement>;
    private emailInput: React.RefObject<HTMLInputElement>;
    constructor(props: Props) {
        super(props);
        this.pwInput = React.createRef();
        this.nomeInput = React.createRef();
        this.emailInput = React.createRef();
    }

    state = {
        email: "",
        emailCheck: false,
        emailTxt: "Email*",
        emailColor: "black",
        password: "",
        passwordCheck: false,
        passwordColor: "black",
        passwordTxt: "Senha*",
        nome: "",
        nomeColor: "black",
        pViewer: false,
        textInput: React.createRef(),
        loading: false
    }


    render() {
        const handleInput = (id: React.FormEvent<HTMLInputElement>) => {
            if (id.currentTarget.id === "email") {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                const email = re.test(id.currentTarget.value);
                this.setState({
                    emailCheck: email
                })
            }

            if (id.currentTarget.id === "password") {
                const re = /^(?=.*\d+)(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%]{6,10}$/
                const pw = re.test(id.currentTarget.value);
                this.setState({
                    passwordCheck: pw
                });
            }
            this.setState({
                [id.currentTarget.id]: id.currentTarget.value
            })
        }
        const formSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            if (!this.state.passwordCheck) {
                this.pwInput.current?.focus()
                this.setState({
                    passwordTxt: "A senha deve ter letras, numeros, minimo de 6 digitos e maximo de 10.",
                    passwordColor: "red"
                })
            } else if (!this.state.emailCheck) {
                this.emailInput.current?.focus()
                this.setState({
                    emailTxt: "Email invalido.",
                    emailColor: "red"
                })
            } else if (this.state.nome === "") {
                this.nomeInput.current?.focus()
                this.setState({
                    nomeColor: "red"
                })
            } else {
                this.setState({
                    loading: true
                })
                await api.post(`/users`, this.state, {
                    headers: { "Access-Control-Allow-Origin": "*" }
                })
                    .then(res => {
                        this.setState({
                            loading: false
                        })
                        alert(res.data.msg);
                    })

            }
        }

        const handlePviewer = () => {
            this.setState({ pViewer: !this.state.pViewer })
        }

        return (
            <>
                <img src={logoImg} alt="logo" className="logo-cadastrar" />
                <main>
                    <h1>
                        Cadastre-se
                    </h1>
                    <p>
                        E rapido e facil.
                    </p>
                    <div className={"div-face"}>
                        <LoginFacebook />
                        {/* <button className={"create-store-face"} onClick={toggleHidden}>
                            Cadastrar com Facebook
                        </button> */}
                    </div>
                    <div className="separator">OU</div>
                    <div className={"form-box"}>
                        <div>
                            <form className={"form-signin"} onSubmit={formSubmit}>
                                <div className="field">
                                    <input type="text" ref={this.nomeInput} name="nome" id="nome" placeholder="Seu nome" onChange={handleInput} />
                                    <label style={{ color: this.state.nomeColor }} htmlFor="nome">Nome*</label>
                                </div>
                                <div className="field">
                                    <input type="text" ref={this.emailInput} name="email" id="email" placeholder="email@email.com" onChange={handleInput} />
                                    <label style={{ color: this.state.emailColor }} htmlFor="email">{this.state.emailTxt}</label>
                                </div>

                                <div className="field">
                                    <div className="p-viewer" onClick={handlePviewer}>
                                        <FiEye size={26} color="rgba(0,0,0,0.6)"></FiEye>
                                    </div>

                                    <input type={this.state.pViewer ? "text" : "password"} ref={this.pwInput} name="password" id="password" placeholder="******" onChange={handleInput} />
                                    <label style={{ color: this.state.passwordColor }} htmlFor="password">{this.state.passwordTxt}</label>
                                </div>
                                <div className="box-buttons">
                                    <button className="create-store-register">
                                        Cadastrar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
                <div className="location">
                    {/* <Link to="/map" className="loginLink">
                        Entrar
                    </Link> */}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    users: state.users.info,
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(UserActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cadastrar);