import React from 'react';
import { Button, Row, Col, Table, Input, Icon, Popconfirm, message, Typography } from 'antd';
import { Link } from 'react-router-dom';
import Axios from '../Servicios/AxiosTipo';
import FuncionesAuxiliares from '../FuncionesAuxiliares';
import ExcelExportImpresora from './ExcelExportImpresora';
import Auth from '../Login/Auth';

const { Title } = Typography;

class TablaImpresora extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showComponent: false,
            showTable: true,
            searchText: '',
            dataSource: [],
            disabelExport:true,
            filteredInfo: null,
            sortedInfo: null,
            index: 0,
            loading: false,
            currentDataSource:[],
            isNotSistemas: Auth.isNotSistemas()
        };
    }

    departamentos() {
        let dpto = [];
        Axios.mostrar_departamentos().then(res => {
            res.data.forEach(function (dato) {
                let dict = {
                    text: dato.nombre,
                    value: dato.nombre
                }
                dpto.push(dict);
            });

        }).catch(err => { console.log(err) });
        return dpto;
    }

    llenar_tabla() {
        let datos = [];
        this.setState({loading: true});
        Axios.mostrar_impresoras().then(res => {
            console.log(res.data)
            datos = FuncionesAuxiliares.transform_data_impresora(res.data);
            this.setState({ dataSource: datos, currentDataSource:datos, disabelExport:false, loading: false }); 
        }).catch(err => {
            console.log(err)
            message.error('No se pueden cargar los datos, inténtelo más tarde', 4);
            this.setState({loading: false});
        });
    }

    limpiarFiltros = () => {
        this.setState({ filteredInfo: null });
    };

    handleChange = (pagination, filters, sorter, currentDataSource) => {
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
            currentDataSource: currentDataSource.currentDataSource
        });
    };

    clearAll = () => {
        this.setState({
            filteredInfo: null,
            sortedInfo: null,
            index: this.state.index + 1
        });
    };

    limpiarBusquedas = () => {
        this.setState({
            index: this.state.index + 1
        })
    }

    componentDidMount() {
        this.llenar_tabla();
    }

    busqueda_array(arr, dataIndex, value) {
        if (arr[dataIndex] !== null) {
            return arr[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase())
        }
    }

    handleDelete(key) {
        Axios.eliminar_equipo(key).then(res => {
            message.success({ content: 'Equipo dado de baja satisfactoriamente', key, duration: 3 });
            this.llenar_tabla();
        }).catch(err => {
            console.log(err.response.data.log)
            message.error('Error al eliminar el registro, inténtelo más tarde', 4);
        });
    }

    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => { this.searchInput = node }
                    }
                    placeholder={`Buscar ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type="primary"
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon="search"
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Buscar
            </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Reset
            </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => this.busqueda_array(record, dataIndex, value),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        }
    });

    handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };

    getColumns = () =>{
        let route = this.state.isNotSistemas ? '/finanzas' : '/sistemas';
        let generalColumns = [
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                fixed: 'left',
                render: (text, record) => <Link to={{ pathname: route+'/impresora/view/'+record.id_equipo}}>{text}</Link>,
                ...this.getColumnSearchProps('codigo')
            },
            {
                title: 'Número de serie',
                dataIndex: 'numero_serie',
                key: 'numero_serie',
                ...this.getColumnSearchProps('numero_serie')
            },
            {
                title: 'Tipo',
                dataIndex: 'tipo',
                key: 'tipo',
                filters: [
                    {
                        text: 'Impresora',
                        value: 'Impresora',
                    },
                    {
                        text: 'Matricial',
                        value: 'Matricial',
                    },
                    {
                        text: 'Brazalete',
                        value: 'Brazalete',
                    },
                    {
                        text: 'Escáner',
                        value: 'Escáner',
                    },
                    {
                        text: 'Multifuncional',
                        value: 'Multifuncional',
                    },
                ],
                onFilter: (value, record) => FuncionesAuxiliares.filtrar_array(record.tipo, value),
                sorter: (a, b) => FuncionesAuxiliares.stringSorter(a.tipo, b.tipo)

            },
            {
                title: 'Marca',
                dataIndex: 'marca',
                key: 'marca',
                ...this.getColumnSearchProps('marca')
            },
            {
                title: 'Estado',
                dataIndex: 'estado_operativo',
                key: 'estado_operativo',
                filters: [
                    {
                        text: 'Disponible',
                        value: 'D',
                    },
                    {
                        text: 'Operativo',
                        value: 'O',
                    },
                    {
                        text: 'En revisión',
                        value: 'ER',
                    },
                    {
                        text: 'Reparado',
                        value: 'R',
                    },
                    {
                        text: 'De baja',
                        value: 'B',
                    }
                ],
                onFilter: (value, record) =>FuncionesAuxiliares.filtrar_array(record.estado_operativo, value),
                sorter: (a, b) => FuncionesAuxiliares.stringSorter(a.estado_operativo, b.estado_operativo)
            },
            {
                title: 'Modelo',
                dataIndex: 'modelo',
                key: 'modelo',
                ...this.getColumnSearchProps('modelo')
            },
            {
                title: 'IP',
                dataIndex: 'ip',
                key: 'ip',
                ...this.getColumnSearchProps('ip')
            },
            {
                title: 'BSPI Punto',
                dataIndex: 'bspi',
                key: 'bspi',
                filters: [
                    {
                        text: 'Hogar Inés Chambers',
                        value: 'Hogar Inés Chambers',
                    },
                    {
                        text: 'Hospital León Becerra',
                        value: 'Hospital León Becerra',
                    },
                    {
                        text: 'Residencia Mercedes Begue',
                        value: 'Residencia Mercedes Begue',
                    },
                    {
                        text: 'Unidad Educativa San José del Buen Pastor',
                        value: 'Unidad Educativa San José del Buen Pastor',
                    }
                ],
                onFilter: (value, record) => FuncionesAuxiliares.filtrar_array(record.bspi, value),
                sorter: (a, b) => FuncionesAuxiliares.stringSorter(a.bspi, b.bspi)
            },
            {
                title: 'Departamento',
                dataIndex: 'dpto',
                key: 'dpto',
                filters: this.departamentos(),
                onFilter: (value, record) => FuncionesAuxiliares.filtrar_array(record.dpto, value),
                sorter: (a, b) => FuncionesAuxiliares.stringSorter(a.dpto, b.dpto)
            },
            {
                title: 'Asignado',
                dataIndex: 'asignado',
                key: 'asignado',
                ...this.getColumnSearchProps('asignado')
            },
            {
                title: 'Tinta',
                dataIndex: 'tinta',
                key: 'tinta',
                ...this.getColumnSearchProps('tinta')
            },
            {
                title: 'Cartucho',
                dataIndex: 'cartucho',
                key: 'cartucho',
                ...this.getColumnSearchProps('cartucho')
            },
            {
                title: 'Toner',
                dataIndex: 'toner',
                key: 'toner',
                ...this.getColumnSearchProps('toner')
            },
            {
                title: 'Rodillo',
                dataIndex: 'rodillo',
                key: 'rodillo',
                ...this.getColumnSearchProps('rodillo')
            },
            {
                title: 'Cinta',
                dataIndex: 'cinta',
                key: 'cinta',
                ...this.getColumnSearchProps('cinta')
            },
            {
                title: 'Rollo/Brazalete',
                dataIndex: 'rollo',
                key: 'rollo',
                ...this.getColumnSearchProps('rollo')
            },
            {
                title: 'Descripción',
                dataIndex: 'descripcion',
                key: 'descripcion'
            },
            
        ];

        let actionsColumns = [
            {
                title: 'Acción',
                key: 'accion',
                fixed: 'right',
                render: (text, record) => (
                    <div>
                        <Link to={{
                            pathname: '/sistemas/impresora/form',
                            state: {
                                info: record,
                                titulo: "Editar impresora"
                            }
                        }} >
                            <Button style={{ marginRight: '2px' }} size="small" type="primary" icon="edit" />
                        </Link>
                        <Popconfirm
                            title="¿Desea dar de baja este equipo?"
                            okText="Si" cancelText="No"
                            onConfirm={() => this.handleDelete(record.id_equipo)}>
                            {record.estado_operativo === 'B' ?
                                <Button disabled type="danger" icon="delete" size="small" /> : <Button type="danger" icon="delete" size="small" />}
                        </Popconfirm>
                    </div>
                ),
            },
        ];

        return this.state.isNotSistemas ? generalColumns : generalColumns.concat(actionsColumns) 
    }


    render() {

        let columns = this.getColumns();

        return (
            <div className="div-container-title">
                <Row>
                    <Col span={12}><Title level={2}>Inventario Impresora</Title></Col>
                    <Col hidden = {this.state.isNotSistemas} className='flexbox'>
                        <Link to={{ pathname: '/sistemas/impresora/form', state: { titulo: "Nueva Impresora" } }} >
                            <Button type="primary" icon="plus">Agregar Impresora</Button>
                        </Link>
                    </Col>
                </Row>
                <div className="div-container">
                    <div >
                        <Row>
                            <Col className='flexbox'>
                                {/* <ButtonGroup style={{ align: 'right' }}> */}
                                    <Button hidden = {this.state.isNotSistemas} type="primary" icon="import">Importar</Button>
                                    <ExcelExportImpresora data={this.state.currentDataSource} dis = {this.state.disabelExport}></ExcelExportImpresora>
                                    {/* <Button type="primary" icon="cloud-download">Exportar</Button> */}
                                {/* </ButtonGroup> */}
                            </Col>
                        </Row>
                    </div>
                    <br />
                    <div className="table-operations">
                        <Button onClick={this.limpiarFiltros}>Limpiar filtros</Button>
                        <Button onClick={this.limpiarBusquedas}>Limpiar búsquedas</Button>
                        <Button onClick={this.clearAll}>Limpiar todo</Button>
                    </div>
                    <Table loading={this.state.loading} bordered key={this.state.index} onChange={this.handleChange} size="small"
                        scroll={{ x: 'max-content' }} columns={columns} dataSource={this.state.dataSource}></Table>
                </div>
            </div>
        );
    }
}

export default TablaImpresora;