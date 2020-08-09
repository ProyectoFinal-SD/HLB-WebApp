import React from 'react';
import '../App.css';
import { Form, Input, Button, Layout, Typography, Row, Col, Select } from 'antd';
import '../custom-antd.css';
import InputComp from '../Componentes/InputComponent';
import AxiosTipo from '../Servicios/AxiosTipo';
//import { Link } from 'react-router-dom';
import AxiosAuth from '../Servicios/AxiosAuth';
//import VistaFormulario from '../Componentes/VistaFormulario'
import Auth from '../Login/Auth';
import FuncionesAuxiliares from '../FuncionesAuxiliares';

const { Content } = Layout;
//const { TextArea } = Input;
const { Title } = Typography;
const tailLayout = { wrapperCol: { offset: 11, span: 5 } };
const layout = { labelCol: { span: 6 }, wrapperCol: { span: 14 }, };
const key = 'updatable';

class PerfilUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titulo: "Perfil De Usario",
            username: Auth.getDataLog().user.username,
            cedula: Auth.getDataLog().user.cedula,
            roles: [],
            dptos: [],
            isNotSistemas: Auth.isNotSistemas()
        };
        this.handle_guardar = this.handle_guardar.bind(this);
    }


    cargar_dptos() {
        AxiosTipo.mostrar_dep_org().then(res => {
            console.log(res.data)
            this.setState({ dptos: res.data });
        }).catch(err => {
            console.log(err);
        });
    }

    cargar_roles() {
        AxiosTipo.mostrar_roles().then(res => {
            console.log(res.data)
            this.setState({ roles: res.data });
        }).catch(err => {
            console.log(err);
        });
    }

    componentDidMount = () => {
        this.cargar_dptos();
        this.cargar_roles();
        this.cargar_datos(this.state.username);
    }

    strongValidator = (rule, value, callback) => {
        try {
            let regExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{7,15}$');
            if (!regExp.test(value)) {
                throw new Error("Su contaseña debe tener entre 7 y 15 caracteres, incluya al menos una mayúscula, minúscula y un número");
            }
        } catch (err) {
            callback(err);
        }
    }

    IDValidator = (rule, value, callback) => {
        try {
            if (value.length < 10) {
                throw new Error("La cedula Ingresada no es valida");
            }
        } catch (err) {
            callback(err);
        }
    }

    handle_guardar = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            values.old_cedula = this.state.cedula;
            values.old_user = this.state.username;
            FuncionesAuxiliares.updateUser(values, key);
        });
    }

    cargar_datos(username) {
        AxiosAuth.mostrar_usuario_det(username).then(respuesta => {
            let res = respuesta.data
            console.log(res)
            this.props.form.setFieldsValue({
                cedula: res.cedula,
                username: res.username,
                nombre: res.nombre,
                apellido: res.apellido,
                id_departamento: res.id_departamento,
                id_rol: res.id_rol,
            })
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Content>
                <div className="div-container-title">

                    <Row>
                        <Col span={12}><Title level={2}>{this.state.titulo}</Title></Col>
                        <Col className='flexbox'>
                            <Button type="primary" icon="left" onClick={this.props.history.goBack} >Volver</Button>
                        </Col>
                    </Row>
                    <div className="div-border-top" >
                        <div className="div-container">
                            <Form {...layout}
                                layout="horizontal"
                                onSubmit={this.handle_guardar}
                                action={this.state.titulo}
                                id={this.state.titulo}
                            >
                                <InputComp disabled={this.state.isNotSistemas} label="Nombres" id="nombre" decorator={getFieldDecorator} />
                                <InputComp disabled={this.state.isNotSistemas} label="Apellidos" id="apellido" decorator={getFieldDecorator} />
                                <Form.Item label="Cedula">
                                    {getFieldDecorator('cedula', {
                                        rules: [{ required: true, message: 'Por favor, ingrese una Cedula Valida' }],
                                    })(<Input disabled={this.state.isNotSistemas}/>)}
                                </Form.Item>
                                <InputComp disabled={this.state.isNotSistemas} label="Usuario" id="username" decorator={getFieldDecorator} />
                                <Form.Item label="Contraseña">
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Por favor, ingrese una contraseña' }],
                                    })(<Input.Password  disabled={this.state.isNotSistemas}/>)}
                                </Form.Item>
                                <Form.Item
                                    label="Departamento"

                                >
                                    {getFieldDecorator('id_departamento', {
                                        rules: [{ required: true, message: 'Debe completar este campo' }]
                                    })(
                                        <Select
                                            disabled={this.state.isNotSistemas}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option key="0" value={null}>----</Select.Option>
                                            {
                                                this.state.dptos.map(dato =>
                                                    <Select.Option key={dato.id_departamento} value={dato.id_departamento}>{dato.nombre + " (" + dato.bspi_punto + ")"}</Select.Option>
                                                )
                                            }
                                        </Select>
                                    )
                                    }
                                </Form.Item >
                                <Form.Item
                                    label="Rol"

                                >
                                    {getFieldDecorator('id_rol', {
                                        rules: [{ required: true, message: 'Debe completar este campo' }]
                                    })(
                                        <Select
                                            disabled={this.state.isNotSistemas}
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            <Select.Option key="0" value={null}>----</Select.Option>
                                            {
                                                this.state.roles.map(dato =>
                                                    <Select.Option key={dato.id_rol} value={dato.id_rol}>{dato.nombre}</Select.Option>
                                                )
                                            }
                                        </Select>
                                    )
                                    }
                                </Form.Item >


                                <Form.Item  {...tailLayout}>
                                    <Button hidden={this.state.isNotSistemas} style={{ marginRight: 7 }} type="primary" htmlType="submit">Guardar Cambios</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </Content>
        );
    }
}

PerfilUser = Form.create({})(PerfilUser);
export default PerfilUser;