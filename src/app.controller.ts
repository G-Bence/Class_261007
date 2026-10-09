import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ArticleView } from './ArticleView.js';
import { ArticleViewDto } from './createarticle.dto.js';
import * as fs from 'fs';


@Controller()
export class AppController {
  private articles: ArticleView[] =  JSON.parse(fs.readFileSync("./src/wiki_articles.json", 'utf-8'));  
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App',
      data: this.articles.toSorted((a, b) => b.title.localeCompare(a.title)) // Sort articles by title in ascending order
    }
  }

  @Get('filter')
  @Render('filter')
  getFilter(@Query('search') search?: string) {
    return {
      title: 'Filter Articles',
      data: this.articles.filter(article => article.title.toLowerCase().includes(search?.toLocaleLowerCase() || '')).toSorted((a, b) => b.views - a.views) // Filter articles by title and sort in ascending order
    }  }



  @Get('newArticle')
  @Render('newArticle')
  getNewArticleForm() {
    return {
      message: '',
      title: 'Add New Article',
      data: this.articles,
      formData: { title: '', url: '', views: '' }
    }
  }


  @Post('newArticle')
  @Render('newArticle')
  getNewArticle(@Body() body: ArticleViewDto) {
    let isSuccess = true;
    const formData = {
      title: body?.title ?? '',
      url: body?.url ?? '',
      views: body?.views ?? ''
    };

    if(!formData.title.trim() || !formData.url.trim() || !formData.views.trim() || isNaN(parseInt(formData.views))) {
      isSuccess = false;
      return {
        title: 'Add New Article',
        message: 'You must fill all the fields!',
        success: isSuccess,
        data: this.articles,
        formData
      };
    }

    if(parseInt(formData.views) < 0) {
      isSuccess = false;
      return {
        title: 'Add New Article',
        message: 'Views must be a non-negative number!',
        success: isSuccess,
        data: this.articles,
        formData
      };
    }


    if(!formData.url.startsWith('https://')) {
      isSuccess = false;
      return {
        title: 'Add New Article',
        message: 'URL must start with https://',
        success: isSuccess,
        data: this.articles,
        formData
      };
    }

    const newArticleData: ArticleView = {
      title: formData.title,
      url: formData.url,
      views: parseInt(formData.views)
    };
    if(isSuccess) {
      this.articles.push(newArticleData);
    }

    return {
      title: 'Add New Article',
      message: 'New article created successfully!',
      success: isSuccess,
      data: this.articles,
      formData: { title: '', url: '', views: '' }
    };

  }
}
