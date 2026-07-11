import { guildSchema, guildSettingSchema } from '@shared/schemas';
import { Request, Response } from 'express';
import z from 'zod';
import { supabase } from '../db';
import { paramSchemas } from '../schemas';

export const getGuildByOwnerId = async (req: Request, res: Response) => {
    try {
        const validation = paramSchemas.idSchema.safeParse(req.params.id);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error).errors,
                status: 400,
            });
        }

        const id = validation.data;

        const { data, error } = await supabase.from('guilds').select('*').eq('owner_id', id);
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
            guilds: data,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const getGuildById = async (req: Request, res: Response) => {
    try {
        const validation = paramSchemas.idSchema.safeParse(req.params.id);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error).errors,
                status: 400,
            });
        }

        const id = validation.data;

        const { data, error } = await supabase.from('guilds').select('*').eq('id', id).single();
        if (error) {
            throw new Error(error.message);
        }

        return res.status(200).json({
            message: 'Success',
            status: 200,
            guild: data,
        });
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : 'Server is not responding...',
            status: 500,
        });
    }
};

export const updateGuildSettings = async (req: Request, res: Response) => {
    try {
        const idValidation = paramSchemas.idSchema.safeParse(req.params.id);
        const settingsValidation = guildSettingSchema.safeParse(req.body);
        if (!idValidation.success || !settingsValidation.success) {
            return res.status(400).json({
                message: new Array<string>().concat(
                    !idValidation.success ? z.treeifyError(idValidation.error).errors : [],
                    !settingsValidation.success ? z.treeifyError(settingsValidation.error as any).errors : [],
                ),
                status: 400,
            });
        }

        const id = idValidation.data;
        const newSettings = settingsValidation.data;

        const { data: currentGuild, error: selectError } = await supabase
            .from('guilds')
            .select('settings')
            .eq('id', id)
            .single();

        if (selectError) {
            throw new Error(selectError.message);
        }

        const mergedSettings = {
            ...(currentGuild.settings as Record<string, any>),
            ...newSettings,
        };

        const { error } = await supabase.from('guilds').update({ settings: mergedSettings }).eq('id', id);

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

export const deleteGuild = async (req: Request, res: Response) => {
    try {
        const validation = paramSchemas.idSchema.safeParse(req.params.id);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error).errors,
                status: 400,
            });
        }

        const id = validation.data;

        const { error } = await supabase.from('guilds').delete().eq('id', id);
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

export const registerGuild = async (req: Request, res: Response) => {
    try {
        const validation = guildSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({
                message: z.treeifyError(validation.error as any).errors,
                status: 400,
            });
        }

        const guild = validation.data;

        const { error } = await supabase.from('guilds').upsert(guild);
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
