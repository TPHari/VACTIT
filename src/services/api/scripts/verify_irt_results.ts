
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const testId = '1767031122990';
    console.log(`Checking IRT scores for test: ${testId}`);

    const trials = await prisma.trial.findMany({
        where: { test_id: testId },
        select: { trial_id: true, processed_score: true }
    });

    if (trials.length === 0) {
        console.log('No trials found for this test.');
        return;
    }

    console.log(`Found ${trials.length} trials.`);
    let processedCount = 0;

    trials.forEach(t => {
        // Check if score is populated and not just empty object/default
        const hasScore = t.processed_score && Object.keys(t.processed_score as object).length > 0;
        if (hasScore) {
            processedCount++;
            console.log(`Trial ${t.trial_id}: HAS SCORE`);
            console.log(JSON.stringify(t.processed_score, null, 2));
        } else {
            console.log(`Trial ${t.trial_id}: No IRT score`);
        }
    });

    console.log(`\nSummary: ${processedCount}/${trials.length} trials have IRT scores.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
