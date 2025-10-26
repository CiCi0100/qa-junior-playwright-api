import { test, expect } from '@playwright/test';

const API_URL = 'https://gorest.co.in/public/v2/users';
const TOKEN = '80c5587ad842a74edd010e64578d4f6a6369904dc2ca34ee42d5ebc2c92dc8d1'; 

test.describe('Testes de API - CRUD de Usuário (GoREST)', () => {
  test('Criar, validar estrutura, consultar, atualizar e deletar usuário', async ({ request }) => {
    const userPayload = {
      name: 'Maria Teste QA',
      gender: 'female',
      email: `maria.teste.qa.${Date.now()}@maildrop.cc`,
      status: 'active'
    };

    // CREATE
    const createResponse = await request.post(API_URL, {
      data: userPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(createResponse.status(), 'Status da criação deve ser 201').toBe(201);
    const createdUser = await createResponse.json();

    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      name: userPayload.name,
      email: userPayload.email,
      gender: userPayload.gender,
      status: userPayload.status
    });

    // READ
    const getResponse = await request.get(`${API_URL}/${createdUser.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(getResponse.status(), 'Status do GET deve ser 200').toBe(200);
    const getUser = await getResponse.json();
    expect(getUser).toMatchObject({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      gender: createdUser.gender,
      status: createdUser.status
    });

    // UPDATE
    const updatedPayload = {
      ...userPayload,
      name: 'Maria Atualizada',
      email: `maria.atualizada.${Date.now()}@maildrop.cc`,
      status: 'inactive'
    };
    const updateResponse = await request.put(`${API_URL}/${createdUser.id}`, {
      data: updatedPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(updateResponse.status(), 'Status da atualização deve ser 200').toBe(200);
    const updatedUser = await updateResponse.json();
    expect(updatedUser).toMatchObject({
      id: createdUser.id,
      name: 'Maria Atualizada',
      email: expect.stringMatching(/maria\.atualizada\.\d+@maildrop\.cc/),
      gender: 'female',
      status: 'inactive'
    });

    // DELETE
    const deleteResponse = await request.delete(`${API_URL}/${createdUser.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deleteResponse.status(), 'Status do DELETE deve ser 204').toBe(204);

    // CONFIRMAÇÃO DELETE
    const confirmDeletionResponse = await request.get(`${API_URL}/${createdUser.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmDeletionResponse.status(), 'GET após DELETE deve retornar 404').toBe(404);
  });
});

