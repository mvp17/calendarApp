import {Fragment, useEffect, useState} from "react";
import { Form, message, Modal, Col, Row, Table, Button, Input, Space, Popconfirm, Tooltip } from "antd";
import { SearchOutlined, QuestionCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useForm } from "antd/es/form/Form";
import CategoryService from "../services/CategoryService";
import { ICategory } from "../models/Category";
import { AxiosResponse } from "axios";


const { Column } = Table;

const CategoriesComponent = () => {
    const categoryService = new CategoryService();

    
    // *******Hooks************* //

    useEffect(() => {
        getCategories();
    }, []);

    const [dataSourceLoading, setDataSourceLoading] = useState(false);
    const [dataSource, setDataSource] = useState<ICategory[]>([]);
    const [createCategoryFormVisible, setCreateCategoryFormVisible] = useState(false);
    const [editCategoryFormVisible, setEditCategoryFormVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<ICategory>()

    const [createForm] = useForm();
    const [editForm] = useForm();

    // *******Hooks************* //

    
    const onFinishCreateCategoryForm = ((category: ICategory) => {
        categoryService.postCategory(category).then(() => {
            getCategories();
            closeCreateModal();
            message.success("The category has been created successfully.")
        }).catch((err) => {
            message.error(err.toString())
        });
    });

    const onFinishEditCategoryForm = ((category: ICategory) => {
        categoryService.patchCategory(category, currentRecord!._id).then(() => {
            closeEditModal();
            message.success("The category has been updated successfully.")
        }).catch((err) => {
            message.error(err.toString())
        });
    });


    const getCategories = () => {
        setDataSourceLoading(true);
        categoryService.getCategories().then((res: AxiosResponse) => {
            let _data: ICategory[] = res.data.map((category: ICategory, index: number) => {
                category['key'] = category['_id'];
                category['index'] = index;
                return category;
            });
            setDataSource(_data);
            setDataSourceLoading(false);
        }).catch((err) => {
            message.error(err.toString());
            setDataSourceLoading(false);
        });
    }

    const deleteCategory = (_id: string) => {
        categoryService.deleteCategory(_id).then(() => {
            message.success("The category has been deleted successfully.");
        }).catch((err) => {
            message.error(err.toString());
        });
        setDataSource(dataSource.filter((category: ICategory) => category['_id'] !== _id));
    }

    // **********Modal******* //
    
    const showCreateModal = () => {
        setCreateCategoryFormVisible(true);
    }
    const closeCreateModal = () => {
        setCreateCategoryFormVisible(false);
        createForm.resetFields();
    }

    const showEditModal = () => {
        setEditCategoryFormVisible(true);
    }
    const closeEditModal = () => {
        editForm.resetFields();
        setEditCategoryFormVisible(false);
        getCategories();
    }

    // **********Modal******* //

    // **********Utils********* //

    const alphabeticalSort = (a: string, b: string) => { return a.localeCompare(b) }

    // **********Utils********* //


    return (
        <Fragment>
            <Modal
                width = {"100vh"}
                visible = {createCategoryFormVisible}
                title = "Create Category"
                onCancel = {closeCreateModal}
                onOk = {createForm.submit} >
                
                <Form form = {createForm} layout = {"vertical"} onFinish = {onFinishCreateCategoryForm}>
                    <Row>
                        <Col span = {10}>
                            <Form.Item name = {"name"} label = {"Name"} rules = {[{required: true}]} hasFeedback>
                                <Input placeholder = {"Category Name"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Modal
                width = {"100vh"}
                visible = {editCategoryFormVisible}
                title = "Edit Category"
                onCancel = {closeEditModal}
                onOk = {editForm.submit} >
                
                <Form form = {editForm} layout = {"vertical"} onFinish = {onFinishEditCategoryForm}>
                    <Row>
                        <Col span = {10}>
                            <Form.Item name = {"name"} label = {"Name"} rules = {[{required: true}]} hasFeedback>
                                <Input placeholder = {"Category Name"}/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>

            <Row>
                <Col span={23}/>
                <Col span={1}>
                    <Button type={"primary"} shape="circle" icon={<PlusOutlined/>} onClick={showCreateModal}/>
                </Col>
            </Row>
            <Row style = {{marginTop: "3vh"}}>
                <Col span = {24}> 
                    <Table size = {"middle"} dataSource = {dataSource}
                        loading = {dataSourceLoading}
                        pagination = {{defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: [5, 10]}}
                        bordered = {true}
                        scroll = {{x: 1300}}>1

                        <Column align = {"center"} title = "Name" dataIndex = "name" key = "name"
                            sortDirections = {['descend', 'ascend']}
                            sorter = {{compare: (a: ICategory, b: ICategory) => alphabeticalSort(a._id, b._id), multiple: 3}}
                            filterIcon = {() => <SearchOutlined/>}
                        />
                        <Column align={"center"} title="Actions" fixed={"right"}
                            render = {(value: ICategory, record: ICategory) => {
                                                return (
                                                    <Fragment>
                                                        <Space size = {"large"}>
                                                            <Tooltip title="Edit">
                                                                <Button shape="circle" icon={<EditOutlined/>} onClick={() => {
                                                                    setCurrentRecord(record)
                                                                    showEditModal();
                                                                    editForm.setFieldsValue(record)
                                                                }}/>
                                                            </Tooltip>
                                                            <Popconfirm 
                                                                title="Are you sure？" onConfirm = { () => {
                                                                                                            deleteCategory(value._id)
                                                                                                        }
                                                                                                }
                                                                icon={ <QuestionCircleOutlined style = {{color: 'red'}} /> }>
                                                                <a> <Button shape="circle" icon = {<DeleteOutlined /> }/> </a>
                                                            </Popconfirm>
                                                        </Space>
                                                    </Fragment>
                                                )
                                            }
                                    }
                        />
                    </Table>
                </Col>
            </Row>
        </Fragment>
    );
}

export default CategoriesComponent;
