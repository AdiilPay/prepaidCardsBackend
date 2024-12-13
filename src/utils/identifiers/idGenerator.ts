import SnowflakeGenerator from './Snowflakes';

export default async function idGenerator(){
    const generator =  await SnowflakeGenerator.getInstance(
        parseInt(process.env.WORKER_ID as string),
        new Date(2024, 11, 1).getTime()
    );
    return generator.nextId();
}





