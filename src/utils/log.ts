import chalk from "chalk";

export class Logger{
    
    static readonly RED = chalk.rgb(205,92,92);
    static readonly BLUE = chalk.rgb(65,105,225);
    static readonly GREEN = chalk.rgb(0,255,127);
    static readonly YELLOW = chalk.rgb(240,230,140);

    static log(log: string){
        console.log(Logger.BLUE("[" + new Date().toLocaleTimeString() + "]") + Logger.GREEN(" | LOG | ") + log);
    }

    static warn(log: string){
        console.log(Logger.BLUE("[" + new Date().toLocaleTimeString() + "]") + Logger.YELLOW(" | WARN | ") + log);
    }

    static error(log: string){
        console.log(Logger.BLUE("[" + new Date().toLocaleTimeString() + "]") + Logger.RED(" | ERROR | ") + log);
    }

    //I don't even know anymore don't ask about this
    static writeLine(log: string){
        console.log(log);
    }
}