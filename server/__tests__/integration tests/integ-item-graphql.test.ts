import { createTestClient } from 'apollo-server-testing';
import gql from 'graphql-tag';
import mockData from '../mocks/mock-data';
import * as controllers from '../../src/controllers';
import { constructTestServer } from '../__utils';

const {
	getAllDataDB,
	getByIDDB,
	getAllBySupplierStatusDB,
	getAllByScheduleLineDB,
	DeleteRecordByIDDB,
	createCreateItemDB,
	updateItemByIDDB,
} = controllers;

const itemMock = {
	insert: jest.fn(async input => {
		console.log('inserttt', { id: '1', ...input });
		return { id: '1', ...input };
	}),
	getById: jest.fn(async id => {
		const filterData = data => {
			if (data.id === id) {
				return data;
			}
		};
		const res = mockData.items.filter(filterData);

		return res[0] || null;
	}),
	getAll: jest.fn(async () => {
		return mockData.users;
	}),
	updateById: jest.fn(async input => {
		return { ...input };
	}),
	deleteById: async id => {
		const filterData = data => {
			if (data.id === id) {
				return data;
			}
		};
		const res = mockData.items.filter(filterData);
		return res[0] || null;
	},
	getAllBySupplierStatus: async id => {},
	getAllByItem: async id => {},
	getAllByScheduleLine: jest.fn(async () => {
		return mockData.items;
	}),
};

const { server }: any = constructTestServer({
	context: {
		createItem: createCreateItemDB(itemMock),
		updateItemById: updateItemByIDDB(itemMock),
		deleteItemById: DeleteRecordByIDDB(itemMock),
		getItemById: getByIDDB(itemMock),
		getAllItems: getAllDataDB(itemMock),
		getAllSupplierStatusByItem: getAllBySupplierStatusDB(itemMock),
		getAllScheduleLinesByItem: getAllByScheduleLineDB(itemMock),
	},
});

describe('Tests', () => {
	//Queries
	it('should fetch all items', async () => {
		const ITEM_ALL = gql`
			query {
				allItems {
					id
					itemNo
					description
					quantity
					uom
					unitPrice
					currency
					deliveryAddress {
						id
					}
					totalAmount
					supplierStatusItem
					scheduleLine {
						id
						quantity
						uom
						unitPrice
						totalAmount
						deliveryDateAndTime
						deliveryStatus {
							id
							status
							dateCreated
							timeCreated
						}
					}
				}
			}
		`;

		const { query } = createTestClient(server);
		const res = await query({ query: ITEM_ALL });

		expect(res).toMatchSnapshot();
	});

	it('should fetch one item ', async () => {
		const SINGLE_ITEM = gql`
			query i($id: String!) {
				item(id: $id) {
					id
					itemNo
					description
					quantity
					uom
					unitPrice
					currency
					deliveryAddress {
						id
					}
					totalAmount
					supplierStatusItem
					scheduleLine {
						id
						quantity
						uom
						unitPrice
						totalAmount
						deliveryDateAndTime
						deliveryStatus {
							id
							status
							dateCreated
							timeCreated
						}
					}
				}
			}
		`;

		const { query } = createTestClient(server);
		const res = await query({
			query: SINGLE_ITEM,
			variables: { id: '1' },
		});

		expect(res).toMatchSnapshot();
	});

	it('should error when no item', async () => {
		const SINGLE_ITEM = gql`
			query i($id: String!) {
				item(id: $id) {
					id
					itemNo
					description
					quantity
					uom
					unitPrice
					currency
					deliveryAddress {
						id
					}
					totalAmount
					supplierStatusItem
					scheduleLine {
						id
						quantity
						uom
						unitPrice
						totalAmount
						deliveryDateAndTime
						deliveryStatus {
							id
							status
							dateCreated
							timeCreated
						}
					}
				}
			}
		`;

		const { query } = createTestClient(server);
		const res = await query({
			query: SINGLE_ITEM,
			variables: { id: '' },
		});

		expect(res).toMatchSnapshot();
	});

	//Mutations

	// it('should create an item', async () => {
	// 	const CREATE_ITEM = gql`
	// 		mutation createI($item: ItemInput!) {
	// 			createItem(item: $item) {
	// 				itemNo
	// 				productId
	// 				description
	// 				quantity
	// 				uom
	// 				unitPrice
	// 				discount
	// 				totalAmount
	// 				deliveryAddress {
	// 					building_name
	// 					zip_code
	// 					state
	// 					street
	// 					city
	// 				}
	// 				scheduleLine {
	// 					quantity
	// 					uom
	// 					unitPrice
	// 					totalAmount
	// 				}
	// 				currency
	// 			}
	// 		}
	// 	`;

	// 	const { mutate } = createTestClient(server);
	// 	const res = await mutate({
	// 		mutation: CREATE_ITEM,
	// 		variables: {
	// 			item: {
	// 				itemNo: '001',
	// 				description: 'Beef',
	// 				productId: '0001',
	// 				quantity: 10,
	// 				uom: 'kilograms',
	// 				unitPrice: 1000,
	// 				discount: 0.05,
	// 				totalAmount: 10000,
	// 				deliveryAddress: { building_name: '002', street: 'Elmer', city: 'Celadon', state: 'Johto', zip_code: '123' },
	// 				scheduleLine: [
	// 					{
	// 						quantity: 10,
	// 						uom: 'kilograms',
	// 						deliveryDateAndTime: 'February 25,2020 4:30PM',
	// 						unitPrice: 1000,
	// 						totalAmount: 10000,
	// 					},
	// 				],
	// 				currency: 'PHP',
	// 			},
	// 		},
	// 	});

	// 	console.log('testtt', res.errors);
	// 	expect(res.errors).toBeUndefined();
	// 	expect(itemMock.insert.mock.calls.length).toBe(1);

	// 	expect(res.data).toMatchObject({
	// 		createItem: {
	// 			id: '1',
	// 			itemNo: '001',
	// 			description: 'Beef',
	// 			productId: '0001',
	// 			quantity: 10,
	// 			uom: 'kilograms',
	// 			unitPrice: 1000,
	// 			discount: 0.05,
	// 			totalAmount: 10000,
	// 			deliveryAddress: { building_name: '002', street: 'Elmer', city: 'Celadon', state: 'Johto', zip_code: '123' },
	// 			scheduleLine: [
	// 				{
	// 					id: '1',
	// 					quantity: 10,
	// 					uom: 'kilograms',
	// 					deliveryDateAndTime: 'February 25,2020 4:30PM',
	// 					unitPrice: 1000,
	// 					totalAmount: 10000,
	// 				},
	// 			],
	// 			currency: 'PHP',
	// 		},
	// 	});
	// 	expect(res).toMatchSnapshot();
	// });

	it('update an item', async () => {
		const UPDATE_ITEM = gql`
			mutation i($item: UpdateItemInput!) {
				updateItem(item: $item) {
					id
					supplierStatusItem
				}
			}
		`;

		const { mutate } = createTestClient(server);
		const res = await mutate({
			mutation: UPDATE_ITEM,
			variables: {
				item: {
					id: '1',
					supplierStatusItem: 'Dispatched',
				},
			},
		});

		expect(res).toMatchSnapshot();
	});

	it('delete an item', async () => {
		const DELETE_ITEM = gql`
			mutation i($id: ID!) {
				deleteItem(id: $id) {
					id
				}
			}
		`;

		const { mutate } = createTestClient(server);
		const res = await mutate({
			mutation: DELETE_ITEM,
			variables: { id: '1' },
		});

		expect(res).toMatchSnapshot();
	});
});
