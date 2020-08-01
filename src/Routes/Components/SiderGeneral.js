import React from 'react';
import { Menu, Icon, Layout  } from 'antd';
import { Link } from 'react-router-dom';
import '../../custom-antd.css';
import { RiRouterLine, RiTerminalWindowLine } from "react-icons/ri";
const { SubMenu } = Menu;
const { Sider } = Layout; 

export default class SiderGeneral extends React.Component{
    state = {
        collapsed: false,
      };
    
      onCollapse = collapsed => {
        this.setState({ collapsed });
      };

      render(){
          return(
            <Sider
            breakpoint="lg"
            collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            {this.state.collapsed ? <img className="App-logo" src={"./Boton.png"} alt="icon" /> : <img className="App-logo" src={"./logo.png"} alt="logo" />}
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <Menu.Item key="11">
                <span>
                <Icon type="home" />
                <span>Inicio
                
                </span>
                </span>
                <Link to="/" />
              </Menu.Item>
              <Menu.Item key="12">
                <span>
                <Icon type="message" />
                <span>Solicitudes
                </span>
                </span>
                <Link to="/solicitud_sistemas" />
              </Menu.Item>
              <Menu.Item key="111">
                <span>
                <Icon type="user" />
                <span>Usuarios
                </span>
                </span>
                <Link to="/users" />
              </Menu.Item>
              <SubMenu
                key="dash"
                title={
                  <span>
                    <Icon type="database" />
                    <span>Inventario</span>
                  </span>
                }
              >
                <Menu.Item key="desktop"><Icon type="desktop" />Desktop
                  <Link to="/desktop" />
                </Menu.Item>
                <Menu.Item key="laptop"><Icon type="laptop" />Laptop
                  <Link to="/laptop" />
                </Menu.Item>
                <Menu.Item key="router"><RiRouterLine className="anticon"/>Router
                  <Link to="/router" />
                </Menu.Item>
                <Menu.Item key="impresora"><Icon type="printer" />Impresora
                  <Link to="/impresora" />
                </Menu.Item>
                <Menu.Item key="varios"><Icon type="appstore" />Otros equipos
                <Link to="/otrosEquipos" />
                </Menu.Item>
                <Menu.Item key="ip"><Icon type="cluster" />IP
                <Link to="/ip" />
                </Menu.Item>
                <Menu.Item key="correo"><Icon type="mail" />Correo
                <Link to="/correo" />
                </Menu.Item>
                <SubMenu
                key="sub2"
                title={
                  <span>
                    <Icon type="rocket" />
                    <span>Extra</span>
                  </span>
                }
              >
                <Menu.Item key="marcas"><Icon type="global" />Marcas
                  <Link to="/marca" />
                </Menu.Item>
                <Menu.Item key="programas"><RiTerminalWindowLine className="anticon" />Programas
                  <Link to="/programa" />
                </Menu.Item>
              </SubMenu>
              </SubMenu>
              

              <SubMenu
                key="rep"
                title={
                  <span>
                    <Icon type="bar-chart" />
                    <span>Reportes</span>
                  </span>
                }
              >
                <Menu.Item key="general"><Icon type="control"/>General
                  <Link to="/reportes/general" />
                </Menu.Item>

                <Menu.Item key="baja"><Icon type="fall"/>Equipos de baja
                  <Link to="/reportes/de-baja" />
                </Menu.Item>
              </SubMenu>

              
            </Menu>
          </Sider>
          );
      }
}