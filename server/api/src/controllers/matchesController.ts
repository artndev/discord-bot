import { matchSchema } from '@shared/schemas';
import { Request, Response } from 'express';
import z from 'zod';
import { supabase } from '../db';
import { paramSchemas } from '../schemas';

export const updateMatch = async (req: Request, res: Response) => {
    try {
        const guildIdValidation = paramSchemas.idSchema.safeParse(req.params.guild_id);
        const idValidation = paramSchemas.uuidSchema.safeParse(req.params.id);
        const matchValidation = matchSchema.safeParse(req.body);

        if (!guildIdValidation.success || !idValidation.success || !matchValidation.success) {
            return res.status(400).json({
                message: new Array<string>().concat(
                    !guildIdValidation.success ? z.treeifyError(guildIdValidation.error).errors : [],
                    !idValidation.success ? z.treeifyError(idValidation.error).errors : [],
                    !matchValidation.success ? z.treeifyError(matchValidation.error as any).errors : [],
                ),
                status: 400,
            });
        }

        const guildId = guildIdValidation.data;
        const id = idValidation.data;
        const match = matchValidation.data;

        const { error } = await supabase.from('matches').update(match).eq('guild_id', guildId).eq('id', id);
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const deleteMatch = async (req: Request, res: Response) => {
    try {
        const guildIdValidation = paramSchemas.idSchema.safeParse(req.params.guild_id);
        const idValidation = paramSchemas.uuidSchema.safeParse(req.params.id);

        if (!guildIdValidation.success || !idValidation.success) {
            return res.status(400).json({
                message: new Array<string>().concat(
                    !guildIdValidation.success ? z.treeifyError(guildIdValidation.error).errors : [],
                    !idValidation.success ? z.treeifyError(idValidation.error).errors : [],
                ),
                status: 400,
            });
        }

        const guildId = guildIdValidation.data;
        const id = idValidation.data;

        const { error } = await supabase.from('matches').delete().eq('guild_id', guildId).eq('id', id);
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const registerMatch = async (req: Request, res: Response) => {
    try {
        const validation = matchSchema.safeParse(req.body);
        const guildIdValidation = paramSchemas.idSchema.safeParse(req.params.guild_id);

        if (!validation.success || !guildIdValidation.success) {
            return res.status(400).json({
                message: new Array<string>().concat(
                    !validation.success ? z.treeifyError(validation.error as any).errors : [],
                    !guildIdValidation.success ? z.treeifyError(guildIdValidation.error).errors : [],
                ),
                status: 400,
            });
        }

        const guildId = guildIdValidation.data;
        const newMatch = validation.data;

        const { data: match, error } = await supabase
            .from('matches')
            .upsert({ ...newMatch, guild_id: guildId })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
            match,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const getAllMatches = async (req: Request, res: Response) => {
    try {
        const guildIdValidation = paramSchemas.idSchema.safeParse(req.params.guild_id);
        console.log(req.params, req.params.guild_id);

        if (!guildIdValidation.success) {
            return res.status(400).json({
                message: new Array<string>().concat(
                    !guildIdValidation.success ? z.treeifyError(guildIdValidation.error).errors : [],
                ),
                status: 400,
            });
        }

        const guildId = guildIdValidation.data;

        const { data: matches, error } = await supabase.from('matches').select('*').eq('guild_id', guildId);
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
            matches,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};
