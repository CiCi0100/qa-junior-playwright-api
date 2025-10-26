import { test, expect } from '@playwright/test';

const USERS_API = 'https://gorest.co.in/public/v2/users';
const POSTS_API = 'https://gorest.co.in/public/v2/posts';
const TOKEN = '80c5587ad842a74edd010e64578d4f6a6369904dc2ca34ee42d5ebc2c92dc8d1'; 

test.describe('Testes de API - CRUD de Usuário e Post (GoREST)', () => {
  test('Criar usuário, criar post, validar, atualizar e deletar tudo', async ({ request }) => {

    // ======== CREATE USER ========
    const userPayload = {
      name: 'Teste Usuário QA',
      gender: 'female',
      email: `usuario.qa.${Date.now()}@maildrop.cc`,
      status: 'active'
    };

    const createUserResponse = await request.post(USERS_API, {
      data: userPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(createUserResponse.status(), 'Status da criação do usuário deve ser 201').toBe(201);

    const createdUser = await createUserResponse.json();
    expect(createdUser).toMatchObject({
      id: expect.any(Number),
      name: userPayload.name,
      email: userPayload.email,
      gender: userPayload.gender,
      status: userPayload.status
    });

    const USER_ID = createdUser.id;

    // ======== CREATE POST ========
    const postPayload = {
      user_id: USER_ID,
      title: `Título de teste ${Date.now()}`,
      body: 'Corpo do post de teste'
    };

    const createPostResponse = await request.post(POSTS_API, {
      data: postPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(createPostResponse.status(), 'Status da criação do post deve ser 201').toBe(201);

    const createdPost = await createPostResponse.json();
    expect(createdPost).toMatchObject({
      id: expect.any(Number),
      user_id: USER_ID,
      title: postPayload.title,
      body: postPayload.body
    });

    // ======== READ POST ========
    const getPostResponse = await request.get(`${POSTS_API}/${createdPost.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(getPostResponse.status(), 'Status do GET do post deve ser 200').toBe(200);

    const getPost = await getPostResponse.json();
    expect(getPost).toMatchObject({
      id: createdPost.id,
      user_id: USER_ID,
      title: postPayload.title,
      body: postPayload.body
    });

    // ======== UPDATE POST ========
    const updatedPostPayload = {
      title: `Título atualizado ${Date.now()}`,
      body: 'Corpo do post atualizado'
    };

    const updatePostResponse = await request.put(`${POSTS_API}/${createdPost.id}`, {
      data: updatedPostPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(updatePostResponse.status(), 'Status da atualização do post deve ser 200').toBe(200);

    const updatedPost = await updatePostResponse.json();
    expect(updatedPost).toMatchObject({
      id: createdPost.id,
      user_id: USER_ID,
      title: updatedPostPayload.title,
      body: updatedPostPayload.body
    });

    // ======== DELETE POST ========
    const deletePostResponse = await request.delete(`${POSTS_API}/${createdPost.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deletePostResponse.status(), 'Status do DELETE do post deve ser 204').toBe(204);

    const confirmPostDeletion = await request.get(`${POSTS_API}/${createdPost.id}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmPostDeletion.status(), 'GET do post após DELETE deve retornar 404').toBe(404);

    // ======== DELETE USER ========
    const deleteUserResponse = await request.delete(`${USERS_API}/${USER_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deleteUserResponse.status(), 'Status do DELETE do usuário deve ser 204').toBe(204);

    const confirmUserDeletion = await request.get(`${USERS_API}/${USER_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmUserDeletion.status(), 'GET do usuário após DELETE deve retornar 404').toBe(404);

  });
});

