import { test, expect } from '@playwright/test';

const USERS_API = 'https://gorest.co.in/public/v2/users';
const POSTS_API = 'https://gorest.co.in/public/v2/posts';
const COMMENTS_API = 'https://gorest.co.in/public/v2/comments';
const TOKEN = '80c5587ad842a74edd010e64578d4f6a6369904dc2ca34ee42d5ebc2c92dc8d1'; // Substitua pelo seu token GoREST

test.describe('Fluxo completo: usuário → post → comentário (GoREST)', () => {
  test('Criar, validar, atualizar, consultar e deletar tudo', async ({ request }) => {

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
    expect(createUserResponse.status()).toBe(201);

    const createdUser = await createUserResponse.json();
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
    expect(createPostResponse.status()).toBe(201);

    const createdPost = await createPostResponse.json();
    const POST_ID = createdPost.id;

    // ======== CREATE COMMENT ========
    const commentPayload = {
      post_id: POST_ID,
      name: 'Comentário de teste',
      email: `comentario.qa.${Date.now()}@maildrop.cc`,
      body: 'Este é um comentário de teste'
    };

    const createCommentResponse = await request.post(COMMENTS_API, {
      data: commentPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(createCommentResponse.status()).toBe(201);

    const createdComment = await createCommentResponse.json();
    const COMMENT_ID = createdComment.id;

    // ======== READ COMMENT ========
    const getCommentResponse = await request.get(`${COMMENTS_API}/${COMMENT_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(getCommentResponse.status()).toBe(200);

    const getComment = await getCommentResponse.json();
    expect(getComment).toMatchObject({
      id: COMMENT_ID,
      post_id: POST_ID,
      name: commentPayload.name,
      email: commentPayload.email,
      body: commentPayload.body
    });

    // ======== UPDATE COMMENT ========
    const updatedCommentPayload = {
      name: 'Comentário atualizado',
      email: `comentario.atualizado.${Date.now()}@maildrop.cc`,
      body: 'Comentário atualizado'
    };

    const updateCommentResponse = await request.put(`${COMMENTS_API}/${COMMENT_ID}`, {
      data: updatedCommentPayload,
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(updateCommentResponse.status()).toBe(200);

    const updatedComment = await updateCommentResponse.json();
    expect(updatedComment).toMatchObject({
      id: COMMENT_ID,
      post_id: POST_ID,
      name: updatedCommentPayload.name,
      email: updatedCommentPayload.email,
      body: updatedCommentPayload.body
    });

    // ======== DELETE COMMENT ========
    const deleteCommentResponse = await request.delete(`${COMMENTS_API}/${COMMENT_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deleteCommentResponse.status()).toBe(204);

    const confirmCommentDeletion = await request.get(`${COMMENTS_API}/${COMMENT_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmCommentDeletion.status()).toBe(404);

    // ======== DELETE POST ========
    const deletePostResponse = await request.delete(`${POSTS_API}/${POST_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deletePostResponse.status()).toBe(204);

    const confirmPostDeletion = await request.get(`${POSTS_API}/${POST_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmPostDeletion.status()).toBe(404);

    // ======== DELETE USER ========
    const deleteUserResponse = await request.delete(`${USERS_API}/${USER_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(deleteUserResponse.status()).toBe(204);

    const confirmUserDeletion = await request.get(`${USERS_API}/${USER_ID}`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(confirmUserDeletion.status()).toBe(404);

  });
});

