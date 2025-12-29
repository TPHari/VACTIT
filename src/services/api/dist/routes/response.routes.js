"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseRoutes = responseRoutes;
const zod_1 = require("zod");
const createResponsesSchema = zod_1.z.object({
    trialId: zod_1.z.string().min(1),
    responses: zod_1.z.array(zod_1.z.object({
        questionId: zod_1.z.string().min(1),
        chosenOption: zod_1.z.string().optional().nullable(),
        responseTime: zod_1.z.number().min(0),
    })).min(1),
});
async function responseRoutes(server) {
    // Get all responses
    server.get('/api/responses', async (request, reply) => {
        try {
            const responses = await server.prisma.response.findMany({
                include: {
                    trial: {
                        select: {
                            trial_id: true,
                            student_id: true,
                            test_id: true
                        }
                    }
                }
            });
            return { data: responses, count: responses.length };
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to fetch responses'
            };
        }
    });
    // Create response
    server.post('/api/responses', async (request, reply) => {
        try {
            const parsed = createResponsesSchema.safeParse(request.body);
            if (!parsed.success) {
                reply.status(422);
                return { error: 'invalid_input', details: parsed.error.flatten() };
            }
            const { trialId, responses } = parsed.data;
            console.log('Creating responses for trialId:', trialId, 'responses count:', responses);
            // ensure trial exists
            const trial = await server.prisma.trial.findUnique({
                where: { trial_id: trialId },
            });
            if (!trial) {
                reply.status(404);
                return { error: 'trial_not_found' };
            }
            // prepare rows
            const rows = responses.map(r => ({
                trial_id: trialId,
                question_id: r.questionId,
                chosen_option: r.chosenOption ?? null,
                response_time: r.responseTime,
            }));
            // insert all responses in a transaction
            //delete existing responses for the trial first
            await server.prisma.response.deleteMany({
                where: { trial_id: trialId },
            });
            const createdResponses = await server.prisma.$transaction(rows.map(row => server.prisma.response.create({ data: row })));
            reply.status(201);
            return { data: createdResponses };
        }
        catch (error) {
            reply.status(500);
            return {
                error: error instanceof Error ? error.message : 'Failed to create responses'
            };
        }
    });
}
